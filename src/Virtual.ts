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
import { getItemText } from "./getItemText";
import { getLiveSpokenPhrase } from "./getLiveSpokenPhrase";
import { getSpokenPhrase } from "./getSpokenPhrase";
import { isElement } from "./isElement";
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
  delay: null,
  skipHover: true,
};

/**
 * TODO: When a modal element is displayed, assistive technologies SHOULD
 * navigate to the element unless focus has explicitly been set elsewhere. Some
 * assistive technologies limit navigation to the modal element's contents. If
 * focus moves to an element outside the modal element, assistive technologies
 * SHOULD NOT limit navigation to the modal element.
 *
 * REF: https://w3c.github.io/aria/#aria-modal
 */

/**
 * TODO: When an assistive technology reading cursor moves from one article to
 * another, assistive technologies SHOULD set user agent focus on the article
 * that contains the reading cursor. If the reading cursor lands on a focusable
 * element inside the article, the assistive technology MAY set focus on that
 * element in lieu of setting focus on the containing article.
 *
 * REF: https://w3c.github.io/aria/#feed
 */

export class Virtual implements ScreenReader {
  #activeNode: AccessibilityNode | null = null;
  #container: Node | null = null;
  #itemTextLog: string[] = [];
  #spokenPhraseLog: string[] = [];
  #treeCache: AccessibilityNode[] | null = null;
  #disconnectDOMObserver: () => void | null = null;

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
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode, true);
  }

  #focusActiveElement() {
    if (!this.#activeNode || !isElement(this.#activeNode.node)) {
      return;
    }

    this.#activeNode.node.focus();
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
    const newActiveNode = tree.at(currentIndex);

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
   * Getter for screen reader commands.
   *
   * Use with `await virtual.perform(command)`.
   */
  get commands() {
    return Object.fromEntries<VirtualCommandKey>(
      Object.keys(commands).map((command: VirtualCommandKey) => [
        command,
        command,
      ])
    ) as { [K in VirtualCommandKey]: K };
  }

  /**
   * Detect whether the screen reader is supported for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async detect() {
    return true;
  }

  /**
   * Detect whether the screen reader is the default screen reader for the current OS.
   *
   * @returns {Promise<boolean>}
   */
  async default() {
    return false;
  }

  /**
   * Turn the screen reader on.
   *
   * @param {object} [options] Additional options.
   */
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
   * Turn the screen reader off.
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
   * Move the screen reader cursor to the previous location.
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
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode);

    return;
  }

  /**
   * Move the screen reader cursor to the next location.
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
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode);

    return;
  }

  /**
   * Perform the default action for the item in the screen reader cursor.
   */
  async act() {
    this.#checkContainer();
    await tick();

    if (!this.#activeNode) {
      return;
    }

    const target = this.#activeNode.node as HTMLElement;

    // TODO: verify that is appropriate for all default actions
    await userEvent.click(target, defaultUserEventOptions);

    return;
  }

  /**
   * Interact with the item under the screen reader cursor.
   */
  async interact() {
    this.#checkContainer();

    return;
  }

  /**
   * Stop interacting with the current item.
   */
  async stopInteracting() {
    this.#checkContainer();

    return;
  }

  /**
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
   * await virtual.press("Control+f");
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

    const rawKeys = key.replaceAll("{", "{{").replaceAll("[", "[[").split("+");
    const modifiers = [];
    const keys = [];

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
   * Type text into the active item.
   *
   * To press a special key, like `Control` or `ArrowDown`, use `virtual.press(key)`.
   *
   * ```ts
   * await virtual.type("my-username");
   * await virtual.press("Enter");
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

    const target = this.#activeNode.node as HTMLElement;
    await userEvent.type(target, text, defaultUserEventOptions);
    await this.#refreshState(true);

    return;
  }

  /**
   * Perform a screen reader command.
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
      container: this.#container,
      currentIndex,
      tree,
    });

    if (typeof nextIndex !== "number") {
      return;
    }

    const newActiveNode = tree.at(nextIndex);
    this.#updateState(newActiveNode);

    return;
  }

  /**
   * Click the mouse.
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
    const target = this.#activeNode.node as HTMLElement;

    await userEvent.pointer(
      [{ target }, { keys, target }],
      defaultUserEventOptions
    );

    return;
  }

  /**
   * Get the last spoken phrase.
   *
   * @returns {Promise<string>} The last spoken phrase.
   */
  async lastSpokenPhrase() {
    this.#checkContainer();
    await tick();

    return this.#spokenPhraseLog.at(-1) ?? "";
  }

  /**
   * Get the text of the item in the screen reader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText() {
    this.#checkContainer();
    await tick();

    return this.#itemTextLog.at(-1) ?? "";
  }

  /**
   * Get the log of all spoken phrases for this screen reader instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog() {
    this.#checkContainer();

    await tick();

    return this.#spokenPhraseLog;
  }

  /**
   * Get the log of all visited item text for this screen reader instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog() {
    this.#checkContainer();

    await tick();

    return this.#itemTextLog;
  }
}
