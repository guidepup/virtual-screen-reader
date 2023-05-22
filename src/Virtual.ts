import type { CommandOptions, ScreenReader } from "@guidepup/guidepup";
import {
  ERR_VIRTUAL_MISSING_CONTAINER,
  ERR_VIRTUAL_NOT_STARTED,
} from "./errors";
import { getAccessibleName } from "./getAccessibleName";
import { getRole } from "./getRole";
import { isInAccessibilityTree } from "./isInAccessibilityTree";
import { notImplemented } from "./notImplemented";
import userEvent from "@testing-library/user-event";

export interface StartOptions extends CommandOptions {
  container: HTMLElement;
}

// TODO: monitor focus change and update the screen reader active element
// TODO: handle aria-live, role="polite", role="alert", and other interruptions

export class Virtual implements ScreenReader {
  #activeElement: HTMLElement | null = null;
  #container: HTMLElement | null = null;
  #itemTextLog: string[] = [];
  #spokenPhraseLog: string[] = [];

  #checkContainer() {
    if (!this.#container) {
      throw new Error(ERR_VIRTUAL_NOT_STARTED);
    }
  }

  #getAccessibilityTree() {
    // TODO: flatten DOM rather than querySelector?
    // E.g. see https://github.com/testing-library/dom-testing-library/blob/main/src/role-helpers.js#L156
    return [this.#container, ...this.#container.querySelectorAll("*")].filter(
      (element) => isInAccessibilityTree(element)
    ) as HTMLElement[];
  }

  #updateState(newActiveElement: HTMLElement) {
    this.#activeElement = newActiveElement;

    const role = getRole(this.#activeElement);
    const accessibleName = getAccessibleName(this.#activeElement);
    const spokenPhrase = [role, accessibleName].filter(Boolean).join(", ");

    this.#itemTextLog.push(accessibleName);
    this.#spokenPhraseLog.push(spokenPhrase);
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

    this.#activeElement = container;
    this.#container = container;

    return;
  }

  async stop() {
    this.#activeElement = null;
    this.#container = null;
    this.#itemTextLog = [];
    this.#spokenPhraseLog = [];

    return;
  }

  async previous() {
    this.#checkContainer();

    const world = this.#getAccessibilityTree();
    const currentIndex = world.indexOf(this.#activeElement);
    const nextIndex = currentIndex === -1 ? 0 : currentIndex - 1;
    const newActiveElement = world.at(nextIndex);

    this.#updateState(newActiveElement);

    return;
  }

  async next() {
    this.#checkContainer();

    const world = this.#getAccessibilityTree();
    const currentIndex = world.indexOf(this.#activeElement);
    const nextIndex =
      currentIndex === -1 || currentIndex === world.length - 1
        ? 0
        : currentIndex + 1;
    const newActiveElement = world.at(nextIndex);

    this.#updateState(newActiveElement);

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

    await userEvent.pointer([
      { target: this.#activeElement },
      { keys, target: this.#activeElement },
    ]);

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
