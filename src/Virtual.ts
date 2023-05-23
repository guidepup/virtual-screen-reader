import {
  AccessibilityNode,
  createAccessibilityTree,
} from "./createAccessibilityTree";
import type { CommandOptions, ScreenReader } from "@guidepup/guidepup";
import {
  ERR_VIRTUAL_MISSING_CONTAINER,
  ERR_VIRTUAL_NOT_STARTED,
} from "./errors";
import { notImplemented } from "./notImplemented";
import userEvent from "@testing-library/user-event";

export interface StartOptions extends CommandOptions {
  container: HTMLElement;
}

// TODO: monitor focus change and update the screen reader active element
// TODO: handle aria-live, role="polite", role="alert", and other interruptions

export class Virtual implements ScreenReader {
  #activeNode: AccessibilityNode | null = null;
  #container: Node | null = null;
  #itemTextLog: string[] = [];
  #spokenPhraseLog: string[] = [];

  #checkContainer() {
    if (!this.#container) {
      throw new Error(ERR_VIRTUAL_NOT_STARTED);
    }
  }

  #getAccessibilityTree() {
    return createAccessibilityTree(this.#container);
  }

  #updateState(accessibilityNode: AccessibilityNode) {
    const { role, accessibleName } = accessibilityNode;
    const spokenPhrase = [role, accessibleName].filter(Boolean).join(", ");

    this.#activeNode = accessibilityNode;
    this.#itemTextLog.push(accessibleName);
    this.#spokenPhraseLog.push(spokenPhrase);
  }

  #getCurrentIndex(tree: AccessibilityNode[]) {
    return tree.findIndex(
      ({ accessibleName, node, role }) =>
        accessibleName === this.#activeNode.accessibleName &&
        node === this.#activeNode.node &&
        role === this.#activeNode.role
    );
  }

  async detect() {
    return true;
  }

  async default() {
    return false;
  }

  async start({ container }: StartOptions = { container: null }) {
    if (!container) {
      throw new Error(ERR_VIRTUAL_MISSING_CONTAINER);
    }

    this.#container = container;
    const tree = this.#getAccessibilityTree();
    this.#updateState(tree[0]);

    return;
  }

  async stop() {
    this.#activeNode = null;
    this.#container = null;
    this.#itemTextLog = [];
    this.#spokenPhraseLog = [];

    return;
  }

  async previous() {
    this.#checkContainer();

    const tree = this.#getAccessibilityTree();
    const currentIndex = this.#getCurrentIndex(tree);
    const nextIndex = currentIndex === -1 ? 0 : currentIndex - 1;
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode);

    return;
  }

  async next() {
    this.#checkContainer();

    const tree = this.#getAccessibilityTree();
    const currentIndex = this.#getCurrentIndex(tree);
    const nextIndex =
      currentIndex === -1 || currentIndex === tree.length - 1
        ? 0
        : currentIndex + 1;
    const newActiveNode = tree.at(nextIndex);

    this.#updateState(newActiveNode);

    return;
  }

  async act() {
    this.#checkContainer();

    notImplemented();

    return;
  }

  async interact() {
    this.#checkContainer();

    return;
  }

  async stopInteracting() {
    this.#checkContainer();

    return;
  }

  async press() {
    this.#checkContainer();

    notImplemented();

    return;
  }

  async type() {
    this.#checkContainer();

    notImplemented();

    return;
  }

  async perform() {
    this.#checkContainer();

    notImplemented();

    return;
  }

  /**
   * Click the mouse.
   *
   * @param {object} [options] Click options.
   */
  async click({ button = "left", clickCount = 1 } = {}) {
    this.#checkContainer();

    const key = `[Mouse${button[0].toUpperCase()}${button.slice(1)}]`;
    const keys = key.repeat(clickCount);
    const target = this.#activeNode.node as HTMLElement;

    await userEvent.pointer([{ target }, { keys, target }]);

    return;
  }

  async lastSpokenPhrase() {
    this.#checkContainer();

    return this.#spokenPhraseLog.at(-1) ?? "";
  }

  async itemText() {
    this.#checkContainer();

    return this.#itemTextLog.at(-1) ?? "";
  }

  async spokenPhraseLog() {
    this.#checkContainer();

    return this.#spokenPhraseLog;
  }

  async itemTextLog() {
    this.#checkContainer();

    return this.#itemTextLog;
  }
}
