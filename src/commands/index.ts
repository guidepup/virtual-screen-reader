import { getNextIndexByRole } from "./getNextIndexByRole";
import { getPreviousIndexByRole } from "./getPreviousIndexByRole";
import { jumpToControlledElement } from "./jumpToControlledElement";
import { jumpToDetailsElement } from "./jumpToDetailsElement";
import { moveToNextAlternateReadingOrderElement } from "./moveToNextAlternateReadingOrderElement";
import { moveToPreviousAlternateReadingOrderElement } from "./moveToPreviousAlternateReadingOrderElement";
import { VirtualCommandArgs } from "./types";

const quickLandmarkNavigationRoles = [
  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role banner.
   *
   * REF: https://w3c.github.io/aria/#banner
   */
  "banner",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role complementary.
   *
   * REF: https://w3c.github.io/aria/#complementary
   */
  "complementary",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role contentinfo.
   *
   * REF: https://w3c.github.io/aria/#contentinfo
   */
  "contentinfo",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * figures.
   *
   * REF: https://w3c.github.io/aria/#figure
   */
  "figure",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role form.
   *
   * REF: https://w3c.github.io/aria/#form
   */
  "form",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role main.
   *
   * REF: https://w3c.github.io/aria/#main
   */
  "main",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role navigation.
   *
   * REF: https://w3c.github.io/aria/#navigation
   */
  "navigation",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role region.
   *
   * REF: https://w3c.github.io/aria/#region
   */
  "region",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role search.
   *
   * REF: https://w3c.github.io/aria/#search
   */
  "search",
] as const;

const quickLandmarkNavigationCommands = quickLandmarkNavigationRoles.reduce<
  Record<string, unknown>
>((accumulatedCommands, role) => {
  const moveToNextCommand = `moveToNext${role.at(0).toUpperCase()}${role.slice(
    1
  )}`;
  const moveToPreviousCommand = `moveToPrevious${role
    .at(0)
    .toUpperCase()}${role.slice(1)}`;

  return {
    ...accumulatedCommands,
    [moveToNextCommand]: getNextIndexByRole([role]),
    [moveToPreviousCommand]: getPreviousIndexByRole([role]),
  };
}, {}) as {
  [K in
    | `moveToNext${Capitalize<(typeof quickLandmarkNavigationRoles)[number]>}`
    | `moveToPrevious${Capitalize<
        (typeof quickLandmarkNavigationRoles)[number]
      >}`]: (args: VirtualCommandArgs) => number | null;
};

export const commands = {
  jumpToControlledElement,
  jumpToDetailsElement,
  moveToNextAlternateReadingOrderElement,
  moveToPreviousAlternateReadingOrderElement,
  ...quickLandmarkNavigationCommands,
  moveToNextLandmark: getNextIndexByRole(quickLandmarkNavigationRoles),
  moveToPreviousLandmark: getPreviousIndexByRole(quickLandmarkNavigationRoles),
};

export type VirtualCommands = {
  [K in keyof typeof commands]: (typeof commands)[K];
};
export type VirtualCommandKey = keyof VirtualCommands;
