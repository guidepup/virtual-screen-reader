import { jumpToControlledElement } from "./jumpToControlledElement";

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
 * TODO: However, when aria-flowto is provided with multiple ID
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

export const commands = {
  jumpToControlledElement,
};

export type VirtualCommands = typeof commands;
export type VirtualCommandKey = keyof VirtualCommands;
