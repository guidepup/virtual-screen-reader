import { HeadingLevel, VirtualCommandArgs } from "./types";
import { getNextIndex } from "./getNextIndex";
import { getPreviousIndex } from "./getPreviousIndex";
import { jumpToControlledElement } from "./jumpToControlledElement";
import { jumpToDetailsElement } from "./jumpToDetailsElement";
import { jumpToErrorMessageElement } from "./jumpToErrorMessageElement";
import { moveToNextAlternateReadingOrderElement } from "./moveToNextAlternateReadingOrderElement";
import { moveToPreviousAlternateReadingOrderElement } from "./moveToPreviousAlternateReadingOrderElement";

const quickLandmarkNavigationRoles = [
  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role banner.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#banner
   */
  "banner",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role complementary.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#complementary
   */
  "complementary",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role contentinfo.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#contentinfo
   */
  "contentinfo",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * figures.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#figure
   */
  "figure",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role form.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#form
   */
  "form",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role main.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#main
   */
  "main",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role navigation.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#navigation
   */
  "navigation",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role region.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#region
   */
  "region",

  /**
   * Assistive technologies SHOULD enable users to quickly navigate to
   * elements with role search.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#search
   */
  "search",
] as const;

const quickAriaRoleNavigationRoles = [
  ...quickLandmarkNavigationRoles,

  /**
    * Strangely, WAI-ARIA doesn't specify that user agents should enable users
    * to quickly navigate to elements with role heading. However, it is very
    * common for screen users to navigate between headings.
    *
    * REF: https://www.w3.org/TR/wai-aria-1.2/#heading
    * REF: https://webaim.org/projects/screenreadersurvey9
    */
  "heading",
] as const;

const quickAriaRoleNavigationCommands = quickAriaRoleNavigationRoles.reduce<
  Record<string, unknown>
>((accumulatedCommands, role) => {
  // The roles are defined above and all non-empty.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const moveToNextCommand = `moveToNext${role.at(0)!.toUpperCase()}${role.slice(
    1
  )}`;

  // The roles are defined above and all non-empty.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const moveToPreviousCommand = `moveToPrevious${role
    .at(0)!
    .toUpperCase()}${role.slice(1)}`;

  return {
    ...accumulatedCommands,
    [moveToNextCommand]: getNextIndex({ roles: [role] }),
    [moveToPreviousCommand]: getPreviousIndex({ roles: [role] }),
  };
}, {}) as {
  [K in
    | `moveToNext${Capitalize<(typeof quickAriaRoleNavigationRoles)[number]>}`
    | `moveToPrevious${Capitalize<
        (typeof quickAriaRoleNavigationRoles)[number]
      >}`]: (args: VirtualCommandArgs) => number | null;
};

const headingLevels: HeadingLevel[] = ["1", "2", "3", "4", "5", "6"];

const headingLevelNavigationCommands = headingLevels.reduce((accumulatedCommands, headingLevel) => {
  const moveToNextCommand = `moveToNextHeadingLevel${headingLevel}`;
  const moveToPreviousCommand = `moveToPreviousHeadingLevel${headingLevel}`;

  return {
    ...accumulatedCommands,
    [moveToNextCommand]: getNextIndex({ headingLevels: [headingLevel] }),
    [moveToPreviousCommand]: getPreviousIndex({ headingLevels: [headingLevel] }),
  };
}, {}) as {
  [K in
    | `moveToNextHeadingLevel${HeadingLevel}`
    | `moveToPreviousHeadingLevel${HeadingLevel}`
  ]: (args: VirtualCommandArgs) => number | null;
};

export const commands = {
  jumpToControlledElement,
  jumpToDetailsElement,
  jumpToErrorMessageElement,
  moveToNextAlternateReadingOrderElement,
  moveToPreviousAlternateReadingOrderElement,
  ...quickAriaRoleNavigationCommands,
  moveToNextLandmark: getNextIndex({ roles: quickLandmarkNavigationRoles }),
  moveToPreviousLandmark: getPreviousIndex({ roles: quickLandmarkNavigationRoles }),
  ...headingLevelNavigationCommands,
};

export type VirtualCommands = {
  [K in keyof typeof commands]: (typeof commands)[K];
};
export type VirtualCommandKey = keyof VirtualCommands;
