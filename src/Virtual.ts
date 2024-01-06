import {
  AccessibilityNode,
  createAccessibilityTree,
} from "./createAccessibilityTree";
import {
  CommandOptions,
  MacOSModifiers,
  ScreenReader,
  WindowsModifiers,
} from "@guidepup/guidepup";
import { commands, VirtualCommandKey, VirtualCommands } from "./commands";
import {
  ERR_VIRTUAL_MISSING_CONTAINER,
  ERR_VIRTUAL_NOT_STARTED,
} from "./errors";
import { getElementFromNode } from "./getElementFromNode";
import { getItemText } from "./getItemText";
import { getLiveSpokenPhrase } from "./getLiveSpokenPhrase";
import { getSpokenPhrase } from "./getSpokenPhrase";
import { observeDOM } from "./observeDOM";
import { tick } from "./tick";
import userEvent from "@testing-library/user-event";
import { VirtualCommandArgs } from "./commands/types";

export interface StartOptions extends CommandOptions {
  /**
   * The bounding HTML element to use the Virtual Screen Reader in.
   *
   * To use the entire page pass `document.body`.
   */
  container: Node;
}

const defaultUserEventOptions = {
  delay: 0,
  skipHover: true,
};

/**
 * TODO: When a modal element is displayed, assistive technologies SHOULD
 * navigate to the element unless focus has explicitly been set elsewhere. Some
 * assistive technologies limit navigation to the modal element's contents. If
 * focus moves to an element outside the modal element, assistive technologies
 * SHOULD NOT limit navigation to the modal element.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-modal
 */

/**
 * TODO: When an assistive technology reading cursor moves from one article to
 * another, assistive technologies SHOULD set user agent focus on the article
 * that contains the reading cursor. If the reading cursor lands on a focusable
 * element inside the article, the assistive technology MAY set focus on that
 * element in lieu of setting focus on the containing article.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#feed
 */

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-virtual)
 *
 * A Virtual Screen Reader class that can be used to launch and control a
 * headless JavaScript screen reader which is compatible with any specification
 * compliant DOM implementation, e.g. jsdom, Jest, or any modern browser.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { Virtual } from "@guidepup/virtual-screen-reader";
 *
 * function setupBasicPage() {
 *   document.body.innerHTML = `
 *   <nav>Nav Text</nav>
 *   <section>
 *     <h1>Section Heading</h1>
 *     <p>Section Text</p>
 *     <article>
 *       <header>
 *         <h1>Article Header Heading</h1>
 *         <p>Article Header Text</p>
 *       </header>
 *       <p>Article Text</p>
 *     </article>
 *   </section>
 *   <footer>Footer</footer>
 *   `;
 * }
 *
 * describe("Screen Reader Tests", () => {
 *   test("should traverse the page announcing the expected roles and content", async () => {
 *     // Setup a page using a framework and testing library of your choice
 *     setupBasicPage();
 *
 *     // Create a new Virtual Screen Reader instance
 *     const virtual = new Virtual();
 *
 *     // Start your Virtual Screen Reader instance
 *     await virtual.start({ container: document.body });
 *
 *     // Navigate your environment with the Virtual Screen Reader just as your users would
 *     while ((await virtual.lastSpokenPhrase()) !== "end of document") {
 *       await virtual.next();
 *     }
 *
 *     // Assert on what your users would really see and hear when using screen readers
 *     expect(await virtual.spokenPhraseLog()).toEqual([
 *       "document",
 *       "navigation",
 *       "Nav Text",
 *       "end of navigation",
 *       "region",
 *       "heading, Section Heading, level 1",
 *       "Section Text",
 *       "article",
 *       "banner",
 *       "heading, Article Header Heading, level 1",
 *       "Article Header Text",
 *       "end of banner",
 *       "Article Text",
 *       "end of article",
 *       "end of region",
 *       "contentinfo",
 *       "Footer",
 *       "end of contentinfo",
 *       "end of document",
 *     ]);
 *
 *     // Stop your Virtual Screen Reader instance
 *     await virtual.stop();
 *   });
 * });
 * ```
 */
export class Virtual implements ScreenReader {
  #activeNode: AccessibilityNode | null = null;
  #container: Node | null = null;
  #itemTextLog: string[] = [];
  #spokenPhraseLog: string[] = [];
  #treeCache: AccessibilityNode[] | null = null;
  #disconnectDOMObserver: (() => void) | null = null;

  #checkContainer() {
    if (!this.#container) {
      throw new Error(ERR_VIRTUAL_NOT_STARTED);
    }
  }

  #getAccessibilityTree() {
    if (!this.#treeCache) {
      this.#treeCache = createAccessibilityTree(this.#container);
      this.#attachFocusListeners();
    }

    return this.#treeCache;
  }

  #invalidateTreeCache() {
    this.#detachFocusListeners();
    this.#treeCache = null;
  }

  #attachFocusListeners() {
    this.#getAccessibilityTree().forEach((treeNode) => {
      treeNode.node.addEventListener(
        "focus",
        this.#handleFocusChange.bind(this)
      );
    });
  }

  #detachFocusListeners() {
    this.#getAccessibilityTree().forEach((treeNode) => {
      treeNode.node.removeEventListener(
        "focus",
        this.#handleFocusChange.bind(this)
      );
    });
  }

  async #handleFocusChange({ target }: FocusEvent) {
    await tick();

    this.#invalidateTreeCache();
    const tree = this.#getAccessibilityTree();
    const nextIndex = tree.findIndex(({ node }) => node === target);

    // This is called when an element in the tree receives focus so it stands
    // that we should be able to find said element in the tree (unless it can
    // be removed somehow between the focus event firing and this code
    // executing?).
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newActiveNode = tree.at(nextIndex)!;

    this.#updateState(newActiveNode, true);
  }

  #focusActiveElement() {
    // Is only called following a null guard for `this.#activeNode`.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = getElementFromNode(this.#activeNode!.node);
    target?.focus();
  }

  async #announceLiveRegions(mutations: MutationRecord[]) {
    await tick();

    const container = this.#container;

    mutations
      .map((mutation) =>
        getLiveSpokenPhrase({
          container,
          mutation,
        })
      )
      .filter(Boolean)
      .forEach((spokenPhrase) => {
        this.#spokenPhraseLog.push(spokenPhrase);
      });
  }

  #updateState(accessibilityNode: AccessibilityNode, ignoreIfNoChange = false) {
    const spokenPhrase = getSpokenPhrase(accessibilityNode);
    const itemText = getItemText(accessibilityNode);

    this.#activeNode = accessibilityNode;

    if (
      ignoreIfNoChange &&
      spokenPhrase === this.#spokenPhraseLog.at(-1) &&
      itemText === this.#itemTextLog.at(-1)
    ) {
      return;
    }

    this.#itemTextLog.push(itemText);
    this.#spokenPhraseLog.push(spokenPhrase);
  }

  async #refreshState(ignoreIfNoChange) {
    await tick();

    this.#invalidateTreeCache();
    const tree = this.#getAccessibilityTree();
    const currentIndex = this.#getCurrentIndexByNode(tree);

    // This only fires after keyboard like interactions, both of which null
    // guard the `this.#activeNode` so it stands that we should still be able
    // to find it in the tree.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newActiveNode = tree.at(currentIndex)!;

    this.#updateState(newActiveNode, ignoreIfNoChange);
  }

  #getCurrentIndex(tree: AccessibilityNode[]) {
    return tree.findIndex(
      ({
        accessibleDescription,
        accessibleName,
        accessibleValue,
        node,
        role,
        spokenRole,
      }) =>
        accessibleDescription === this.#activeNode?.accessibleDescription &&
        accessibleName === this.#activeNode?.accessibleName &&
        accessibleValue === this.#activeNode?.accessibleValue &&
        node === this.#activeNode?.node &&
        role === this.#activeNode?.role &&
        spokenRole === this.#activeNode?.spokenRole
    );
  }

  #getCurrentIndexByNode(tree: AccessibilityNode[]) {
    return tree.findIndex(({ node }) => node === this.#activeNode?.node);
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-active-node)
   *
   * Getter for the active node under the Virtual Screen Reader cursor.
   *
   * Note that this is not always the same as the currently focused node.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the next element.
   *   await virtual.next();
   *
   *   // Log the currently focused node.
   *   console.log(virtual.activeNode);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @returns {Node|null}
   */
  get activeNode() {
    return this.#activeNode?.node ?? null;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-commands)
   *
   * Getter for all Virtual Screen Reader commands.
   *
   * Use with the `await virtual.perform(command)` command to invoke an action:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next landmark.
   *   await virtual.perform(virtual.commands.moveToNextLandmark);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  get commands() {
    return Object.fromEntries<VirtualCommandKey>(
      (Object.keys(commands) as VirtualCommandKey[]).map(
        (command: VirtualCommandKey) => [command, command]
      )
    ) as { [K in VirtualCommandKey]: K };
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-detect)
   *
   * Detect whether the screen reader is supported for the current OS:
   *
   * - `true` for all OS
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   const isVirtualSupportedScreenReader = await virtual.detect();
   *
   *   console.log(isVirtualSupportedScreenReader);
   * });
   * ```
   *
   * @returns {Promise<boolean>}
   */
  async detect() {
    return true;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-default)
   *
   * Detect whether the screen reader is the default screen reader for the current OS.
   *
   * - `false` for all OS
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   const isVirtualDefaultScreenReader = await virtual.default();
   *
   *   console.log(isVirtualDefaultScreenReader);
   * });
   * ```
   *
   * @returns {Promise<boolean>}
   */
  async default() {
    return false;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-start)
   *
   * Turn the Virtual Screen Reader on.
   *
   * This must be called before any other Virtual command can be issued.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader on the entire page.
   *   await virtual.start({ container: document.body });
   *
   *   // ... perform some commands.
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @param {object} [options] Additional options.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore for non-TS users we default the container to `null` which
  // prompts the missing container error.
  async start({ container }: StartOptions = { container: null }) {
    if (!container) {
      throw new Error(ERR_VIRTUAL_MISSING_CONTAINER);
    }

    this.#container = container;

    this.#disconnectDOMObserver = observeDOM(
      container,
      (mutations: MutationRecord[]) => {
        this.#invalidateTreeCache();
        this.#announceLiveRegions(mutations);
      }
    );

    const tree = this.#getAccessibilityTree();

    if (!tree.length) {
      return;
    }

    this.#updateState(tree[0]);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-stop)
   *
   * Turn the Virtual Screen Reader off.
   *
   * Calling this method will clear any item text or spoken phrases collected by Virtual.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // ... perform some commands.
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async stop() {
    this.#disconnectDOMObserver?.();
    this.#invalidateTreeCache();

    this.#activeNode = null;
    this.#container = null;
    this.#itemTextLog = [];
    this.#spokenPhraseLog = [];

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-previous)
   *
   * Move the screen reader cursor to the previous location.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the previous item.
   *   await virtual.previous();
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async previous() {
    this.#checkContainer();
    await tick();

    const tree = this.#getAccessibilityTree();

    if (!tree.length) {
      return;
    }

    const currentIndex = this.#getCurrentIndex(tree);
    const nextIndex = currentIndex === -1 ? 0 : currentIndex - 1;
    // We've covered the tree having no length so there must be at least one
    // index, and we ensure to zero-guard with the logic above.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newActiveNode = tree.at(nextIndex)!;

    this.#updateState(newActiveNode);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-next)
   *
   * Move the screen reader cursor to the next location.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the next item.
   *   await virtual.next();
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async next() {
    this.#checkContainer();
    await tick();

    const tree = this.#getAccessibilityTree();

    if (!tree.length) {
      return;
    }

    const currentIndex = this.#getCurrentIndex(tree);
    const nextIndex =
      currentIndex === -1 || currentIndex === tree.length - 1
        ? 0
        : currentIndex + 1;
    // We've covered the tree having no length so there must be at least one
    // index, and we ensure to zero-guard with the logic above.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newActiveNode = tree.at(nextIndex)!;

    this.#updateState(newActiveNode);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-act)
   *
   * Perform the default action for the item in the Virtual Screen Reader cursor.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the next item.
   *   await virtual.next();
   *
   *   // Perform the default action for the item.
   *   await virtual.act();
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async act() {
    this.#checkContainer();
    await tick();

    if (!this.#activeNode) {
      return;
    }

    const target = getElementFromNode(this.#activeNode.node);

    // TODO: verify that is appropriate for all default actions
    await userEvent.click(target, defaultUserEventOptions);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-interact)
   *
   * No-op to provide same API across screen readers.
   *
   * The Virtual Screen Reader does not require users to perform an additional
   * command to interact with the item in the Virtual Screen Reader cursor.
   */
  async interact() {
    this.#checkContainer();

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-stop-interacting)
   *
   * No-op to provide same API across screen readers.
   *
   * The Virtual Screen Reader does not require users to perform an additional
   * command to interact with the item in the Virtual Screen Reader cursor.
   */
  async stopInteracting() {
    this.#checkContainer();

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-press)
   *
   * Press a key on the active item.
   *
   * `key` can specify the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
   * value or a single character to generate the text for. A superset of the `key` values can be found
   * [on the MDN key values page](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:
   *
   * `F1` - `F20`, `Digit0` - `Digit9`, `KeyA` - `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
   * `Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.
   *
   * Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta` (OS permitting).
   *
   * Holding down `Shift` will type the text that corresponds to the `key` in the upper case.
   *
   * If `key` is a single character, it is case-sensitive, so the values `a` and `A` will generate different respective
   * texts.
   *
   * Shortcuts such as `key: "Control+f"` or `key: "Control+Shift+f"` are supported as well. When specified with the
   * modifier, modifier is pressed and being held while the subsequent key is being pressed.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Open a find text modal.
   *   await virtual.press("Command+f");
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @param {string} key Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
   */
  async press(key: string) {
    this.#checkContainer();
    await tick();

    if (!this.#activeNode) {
      return;
    }

    const rawKeys = key.replace(/{/g, "{{").replace(/\[/g, "[[").split("+");
    const modifiers: string[] = [];
    const keys: string[] = [];

    rawKeys.forEach((rawKey) => {
      if (
        typeof MacOSModifiers[rawKey] !== "undefined" ||
        typeof WindowsModifiers[rawKey] !== "undefined"
      ) {
        modifiers.push(rawKey);
      } else {
        keys.push(rawKey);
      }
    });

    const keyboardCommand = [
      ...modifiers.map((modifier) => `{${modifier}>}`),
      ...keys.map((key) => `{${key}}`),
      ...modifiers.reverse().map((modifier) => `{/${modifier}}`),
    ].join("");

    this.#focusActiveElement();
    await userEvent.keyboard(keyboardCommand, defaultUserEventOptions);
    await this.#refreshState(true);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-type)
   *
   * Type text into the active item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `virtual.press(key)`.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Type a username and key Enter.
   *   await virtual.type("my-username");
   *   await virtual.press("Enter");
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @param {string} text Text to type into the active item.
   */
  async type(text: string) {
    this.#checkContainer();
    await tick();

    if (!this.#activeNode) {
      return;
    }

    const target = getElementFromNode(this.#activeNode.node);
    await userEvent.type(target, text, defaultUserEventOptions);
    await this.#refreshState(true);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-perform)
   *
   * Perform a Virtual Screen Reader command.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next landmark.
   *   await virtual.perform(virtual.commands.moveToNextLandmark);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @param {string} command Screen reader command.
   * @param {object} [options] Command options.
   */
  async perform<
    T extends VirtualCommandKey,
    K extends Omit<Parameters<VirtualCommands[T]>[0], keyof VirtualCommandArgs>
  >(command: T, options?: { [L in keyof K]: K[L] } & CommandOptions) {
    this.#checkContainer();
    await tick();

    const tree = this.#getAccessibilityTree();

    if (!tree.length) {
      return;
    }

    const currentIndex = this.#getCurrentIndex(tree);
    const nextIndex = commands[command]?.({
      ...options,
      // `this.#checkContainer();` above null guards us here.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: this.#container!,
      currentIndex,
      tree,
    });

    if (typeof nextIndex !== "number") {
      return;
    }

    // We know the tree has length, and we guard against the command not being
    // able to find an index in the tree so we are fine.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newActiveNode = tree.at(nextIndex)!;
    this.#updateState(newActiveNode);

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-click)
   *
   * Click the mouse.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Left-click the mouse.
   *   await virtual.click();
   *
   *   // Left-click the mouse using specific options.
   *   await virtual.click({ button: "left", clickCount: 1 });
   *
   *   // Double-right-click the mouse.
   *   await virtual.click({ button: "right", clickCount: 2 });
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @param {object} [options] Click options.
   */
  async click({ button = "left", clickCount = 1 } = {}) {
    this.#checkContainer();
    await tick();

    if (!this.#activeNode) {
      return;
    }

    const key = `[Mouse${button[0].toUpperCase()}${button.slice(1)}]`;
    const keys = key.repeat(clickCount);
    const target = getElementFromNode(this.#activeNode.node);

    await userEvent.pointer(
      [{ target }, { keys, target }],
      defaultUserEventOptions
    );

    return;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-last-spoken-phrase)
   *
   * Get the last spoken phrase.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the next item.
   *   await virtual.next();
   *
   *   // Get the phrase spoken by the Virtual Screen Reader from moving to the next item above.
   *   const lastSpokenPhrase = await virtual.lastSpokenPhrase();
   *   console.log(lastSpokenPhrase);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase() {
    this.#checkContainer();
    await tick();

    return this.#spokenPhraseLog.at(-1) ?? "";
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-item-text)
   *
   * Get the text of the item in the Virtual Screen Reader cursor.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move to the next item.
   *   await virtual.next();
   *
   *   // Get the text (if any) for the item currently in focus by the Virtual
   *   // screen reader cursor.
   *   const itemText = await virtual.itemText();
   *   console.log(itemText);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText() {
    this.#checkContainer();
    await tick();

    return this.#itemTextLog.at(-1) ?? "";
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-spoken-phrase-log)
   *
   * Get the log of all spoken phrases for this Virtual Screen Reader instance.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move through several items.
   *   for (let i = 0; i < 10; i++) {
   *     await virtual.next();
   *   }
   *
   *   // Get the phrase spoken by the Virtual Screen Reader from moving through the
   *   // items above.
   *   const spokenPhraseLog = await virtual.spokenPhraseLog();
   *   console.log(spokenPhraseLog);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog() {
    this.#checkContainer();

    await tick();

    return this.#spokenPhraseLog;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-item-text-log)
   *
   * Get the log of all visited item text for this Virtual Screen Reader instance.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Move through several items.
   *   for (let i = 0; i < 10; i++) {
   *     await virtual.next();
   *   }
   *
   *   // Get the text (if any) for all the items visited by the Virtual screen
   *   // reader cursor.
   *   const itemTextLog = await virtual.itemTextLog();
   *   console.log(itemTextLog);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog() {
    this.#checkContainer();

    await tick();

    return this.#itemTextLog;
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-clear-spoken-phrase-log)
   *
   * Clear the log of all spoken phrases for this Virtual Screen Reader
   * instance.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // ... perform some commands.
   *
   *   // Clear the spoken phrase log.
   *   await virtual.clearSpokenPhraseLog();
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async clearSpokenPhraseLog() {
    this.#checkContainer();

    await tick();

    this.#spokenPhraseLog = [];
  }

  /**
   * [API Reference](https://www.guidepup.dev/docs/api/class-virtual#virtual-clear-item-text-log)
   *
   * Clear the log of all visited item text for this Virtual Screen Reader
   * instance.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // ... perform some commands.
   *
   *   // Clear the item text log.
   *   await virtual.clearItemTextLog();
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  async clearItemTextLog() {
    this.#checkContainer();

    await tick();

    this.#itemTextLog = [];
  }
}
