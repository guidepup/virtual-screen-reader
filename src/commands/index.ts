import { jumpToControlledElement } from "./jumpToControlledElement";
import { moveToNextAlternateReadingOrderElement } from "./moveToNextAlternateReadingOrderElement";
import { moveToPreviousAlternateReadingOrderElement } from "./moveToPreviousAlternateReadingOrderElement";

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

export const commands = {
  jumpToControlledElement,
  moveToNextAlternateReadingOrderElement,
  moveToPreviousAlternateReadingOrderElement,
};

export type VirtualCommands = typeof commands;
export type VirtualCommandKey = keyof VirtualCommands;
