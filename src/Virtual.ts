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
import {
  ERR_VIRTUAL_MISSING_CONTAINER,
  ERR_VIRTUAL_NOT_STARTED,
} from "./errors";
import { aria } from "aria-query";
import { getItemText } from "./getItemText";
import { getSpokenPhrase } from "./getSpokenPhrase";
import { isElement } from "./isElement";
import { notImplemented } from "./notImplemented";
import userEvent from "@testing-library/user-event";

export interface StartOptions extends CommandOptions {
  /**
   * The bounding HTML element to use the Virtual Screen Reader in.
   *
   * To use the entire page pass `document.body`.
   */
  container: HTMLElement;
}

const defaultUserEventOptions = {
  delay: null,
  skipHover: true,
};

const observedAttributes = [
  ...aria.keys(),
  "alt",
  "class",
  "checked",
  "control",
  "disabled",
  "for",
  "hidden",
  "label",
  "labels",
  "style",
  "title",
  "type",
  "value",
];

/**
 * TODO: handle live region roles:
 *
 * - alert
 * - log
 * - marquee
 * - status
 * - timer
 * - alertdialog
 *
 * And handle live region attributes:
 *
 * - aria-atomic
 * - aria-busy
 * - aria-live
 * - aria-relevant
 *
 * When live regions are marked as polite, assistive technologies SHOULD
 * announce updates at the next graceful opportunity, such as at the end of
 * speaking the current sentence or when the user pauses typing. When live
 * regions are marked as assertive, assistive technologies SHOULD notify the
 * user immediately.
 *
 * REF:
 *
 * - https://w3c.github.io/aria/#live_region_roles
 * - https://w3c.github.io/aria/#window_roles
 * - https://w3c.github.io/aria/#attrs_liveregions
 * - https://w3c.github.io/aria/#aria-live
 */

/**
 * TODO: handle logical descendants via aria-activedescendant and aria-owns
 *
 * REF: https://w3c.github.io/aria/#state_prop_def
 */

/**
 * TODO: When a modal element is displayed, assistive technologies SHOULD
 * navigate to the element unless focus has explicitly been set elsewhere. Some
 * assistive technologies limit navigation to the modal element's contents. If
 * focus moves to an element outside the modal element, assistive technologies
 * SHOULD NOT limit navigation to the modal element.
 *
 * REF: https://w3c.github.io/aria/#aria-modal
 */

const observeDOM = (function () {
  const MutationObserver = window.MutationObserver;

  return function observeDOM(
    node: Node,
    onChange: MutationCallback
  ): () => void {
    if (!isElement(node)) {
      return;
    }

    if (MutationObserver) {
      const mutationObserver = new MutationObserver(onChange);

      mutationObserver.observe(node, {
        attributes: true,
        attributeFilter: observedAttributes,
        childList: true,
        subtree: true,
      });

      return () => {
        mutationObserver.disconnect();
      };
    }

    return () => {
      // gracefully fallback to not supporting Accessibility Tree refreshes if
      // the DOM changes.
    };
  };
})();

async function tick() {
  return await new Promise<void>((resolve) => setTimeout(() => resolve()));
}

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

  #handleFocusChange({ target }: FocusEvent) {
    const tree = this.#getAccessibilityTree();
    const nextIndex = tree.findIndex(({ node }) => node === target);
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode);
  }

  #updateState(accessibilityNode: AccessibilityNode) {
    const spokenPhrase = getSpokenPhrase(accessibilityNode);
    const itemText = getItemText(accessibilityNode);

    this.#activeNode = accessibilityNode;
    this.#itemTextLog.push(itemText);
    this.#spokenPhraseLog.push(spokenPhrase);
  }

  async #refreshState() {
    await tick();

    this.#invalidateTreeCache();
    const tree = this.#getAccessibilityTree();
    const currentIndex = this.#getCurrentIndexByNode(tree);
    const newActiveNode = tree.at(currentIndex);

    this.#updateState(newActiveNode);
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
      this.#invalidateTreeCache.bind(this)
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
   * await keyboard.press("Control+f");
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
      ...keys,
      ...modifiers.reverse().map((modifier) => `{/${modifier}}`),
    ].join("");

    await this.click();
    await userEvent.keyboard(keyboardCommand, defaultUserEventOptions);
    await this.#refreshState();

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
    await this.#refreshState();

    return;
  }

  /**
   * Perform a screen reader command.
   *
   * Currently not implemented.
   */
  async perform() {
    this.#checkContainer();
    await tick();

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role banner.
     *
     * REF: https://w3c.github.io/aria/#banner
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role complementary.
     *
     * REF: https://w3c.github.io/aria/#complementary
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role contentinfo.
     *
     * REF: https://w3c.github.io/aria/#contentinfo
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * figures.
     *
     * REF: https://w3c.github.io/aria/#figure
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role form.
     *
     * REF: https://w3c.github.io/aria/#form
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * landmark regions.
     *
     * REF: https://w3c.github.io/aria/#landmark
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role main.
     *
     * REF: https://w3c.github.io/aria/#main
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role navigation.
     *
     * REF: https://w3c.github.io/aria/#navigation
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role region.
     *
     * REF: https://w3c.github.io/aria/#region
     */

    /**
     * TODO: Assistive technologies SHOULD enable users to quickly navigate to
     * elements with role search.
     *
     * REF: https://w3c.github.io/aria/#search
     */

    /**
     * TODO:  However, when aria-flowto is provided with multiple ID
     * references, assistive technologies SHOULD present the referenced
     * elements as path choices.
     *
     * In the case of one or more ID references, user agents or assistive
     * technologies SHOULD give the user the option of navigating to any of the
     * targeted elements. The name of the path can be determined by the name of
     * the target element of the aria-flowto attribute. Accessibility APIs can
     * provide named path relationships.
     *
     * REF: https://w3c.github.io/aria/#aria-flowto
     */

    notImplemented();
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

    return this.#spokenPhraseLog.at(-1) ?? "";
  }

  /**
   * Get the text of the item in the screen reader cursor.
   *
   * @returns {Promise<string>} The item's text.
   */
  async itemText() {
    this.#checkContainer();

    return this.#itemTextLog.at(-1) ?? "";
  }

  /**
   * Get the log of all spoken phrases for this screen reader instance.
   *
   * @returns {Promise<string[]>} The spoken phrase log.
   */
  async spokenPhraseLog() {
    this.#checkContainer();

    return this.#spokenPhraseLog;
  }

  /**
   * Get the log of all visited item text for this screen reader instance.
   *
   * @returns {Promise<string[]>} The item text log.
   */
  async itemTextLog() {
    this.#checkContainer();

    return this.#itemTextLog;
  }
}
