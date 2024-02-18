import { getNextIndexByRoleAndAttributes } from "./getNextIndexByRoleAndAttributes.js";
import { getPreviousIndexByRoleAndAttributes } from "./getPreviousIndexByRoleAndAttributes.js";
import { jumpToControlledElement } from "./jumpToControlledElement.js";
import { jumpToDetailsElement } from "./jumpToDetailsElement.js";
import { jumpToErrorMessageElement } from "./jumpToErrorMessageElement.js";
import { moveToNextAlternateReadingOrderElement } from "./moveToNextAlternateReadingOrderElement.js";
import { moveToPreviousAlternateReadingOrderElement } from "./moveToPreviousAlternateReadingOrderElement.js";
import { VirtualCommandArgs } from "./types.js";

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
   * WAI-ARIA doesn't specify that assistive technologies should enable users
   * to quickly navigate to elements with role heading. However, it is very
   * common for assistive technology users to navigate between headings.
   *
   * REF:
   * - https://www.w3.org/TR/wai-aria-1.2/#heading
   * - https://webaim.org/projects/screenreadersurvey9/#heading
   *
   * MUST requirements:
   *
   * Headings provide an outline of the page and users need to be able to
   * quickly navigate to different sections of the page.
   *
   * REF: https://a11ysupport.io/tech/aria/heading_role
   */
  "heading",
] as const;

interface QuickAriaRoleNavigationCommands {
  /**
   * Move to the next element with a [`banner`](https://www.w3.org/TR/wai-aria-1.2/#banner)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next banner element.
   *   await virtual.perform(virtual.commands.moveToNextBanner);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextBanner: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`banner`](https://www.w3.org/TR/wai-aria-1.2/#banner)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous banner element.
   *   await virtual.perform(virtual.commands.moveToPreviousBanner);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousBanner: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`complementary`](https://www.w3.org/TR/wai-aria-1.2/#complementary)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next complementary element.
   *   await virtual.perform(virtual.commands.moveToNextComplementary);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextComplementary: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`complementary`](https://www.w3.org/TR/wai-aria-1.2/#complementary)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous complementary element.
   *   await virtual.perform(virtual.commands.moveToPreviousComplementary);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousComplementary: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`contentinfo`](https://www.w3.org/TR/wai-aria-1.2/#contentinfo)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next contentinfo element.
   *   await virtual.perform(virtual.commands.moveToNextContentInfo);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextContentinfo: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`contentinfo`](https://www.w3.org/TR/wai-aria-1.2/#contentinfo)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous contentinfo element.
   *   await virtual.perform(virtual.commands.moveToPreviousContentinfo);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousContentinfo: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`figure`](https://www.w3.org/TR/wai-aria-1.2/#figure)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next figure element.
   *   await virtual.perform(virtual.commands.moveToNextFigure);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextFigure: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`figure`](https://www.w3.org/TR/wai-aria-1.2/#figure)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous figure element.
   *   await virtual.perform(virtual.commands.moveToPreviousFigure);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousFigure: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`form`](https://www.w3.org/TR/wai-aria-1.2/#form)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next form element.
   *   await virtual.perform(virtual.commands.moveToNextForm);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextForm: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`form`](https://www.w3.org/TR/wai-aria-1.2/#form)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous form element.
   *   await virtual.perform(virtual.commands.moveToPreviousForm);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousForm: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`main`](https://www.w3.org/TR/wai-aria-1.2/#main)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next main element.
   *   await virtual.perform(virtual.commands.moveToNextMain);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextMain: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`main`](https://www.w3.org/TR/wai-aria-1.2/#main)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous main element.
   *   await virtual.perform(virtual.commands.moveToPreviousMain);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousMain: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`navigation`](https://www.w3.org/TR/wai-aria-1.2/#navigation)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next navigation element.
   *   await virtual.perform(virtual.commands.moveToNextNavigation);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextNavigation: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`navigation`](https://www.w3.org/TR/wai-aria-1.2/#navigation)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous navigation element.
   *   await virtual.perform(virtual.commands.moveToPreviousNavigation);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousNavigation: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`region`](https://www.w3.org/TR/wai-aria-1.2/#region)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next region element.
   *   await virtual.perform(virtual.commands.moveToNextRegion);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextRegion: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`region`](https://www.w3.org/TR/wai-aria-1.2/#region)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous region element.
   *   await virtual.perform(virtual.commands.moveToPreviousRegion);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousRegion: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`search`](https://www.w3.org/TR/wai-aria-1.2/#search)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next search element.
   *   await virtual.perform(virtual.commands.moveToNextSearch);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextSearch: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`search`](https://www.w3.org/TR/wai-aria-1.2/#search)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous search element.
   *   await virtual.perform(virtual.commands.moveToPreviousSearch);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousSearch: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeading);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeading: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role.
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeading);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeading: (args: VirtualCommandArgs) => number | null;
}

const quickAriaRoleNavigationCommands: QuickAriaRoleNavigationCommands =
  quickAriaRoleNavigationRoles.reduce<Record<string, unknown>>(
    (accumulatedCommands, role) => {
      // The roles are defined above and all non-empty.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const moveToNextCommand = `moveToNext${role
        .at(0)!
        .toUpperCase()}${role.slice(1)}`;

      // The roles are defined above and all non-empty.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const moveToPreviousCommand = `moveToPrevious${role
        .at(0)!
        .toUpperCase()}${role.slice(1)}`;

      return {
        ...accumulatedCommands,
        [moveToNextCommand]: getNextIndexByRoleAndAttributes({ roles: [role] }),
        [moveToPreviousCommand]: getPreviousIndexByRoleAndAttributes({
          roles: [role],
        }),
      };
    },
    {}
  ) as {
    [K in
      | `moveToNext${Capitalize<(typeof quickAriaRoleNavigationRoles)[number]>}`
      | `moveToPrevious${Capitalize<
          (typeof quickAriaRoleNavigationRoles)[number]
        >}`]: (args: VirtualCommandArgs) => number | null;
  };

type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";

const headingLevels: HeadingLevel[] = ["1", "2", "3", "4", "5", "6"];

interface HeadingLevelNavigationCommands {
  /**
   * Move to the next element with a level 1 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 1 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel1);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel1: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 1 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 1 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel1);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel1: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a level 2 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 2 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel2);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel2: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 2 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 2 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel2);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel2: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a level 3 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 3 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel3);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel3: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 3 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 3 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel3);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel3: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a level 4 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 4 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel4);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel4: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 4 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 4 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel4);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel4: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a level 5 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 5 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel5);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel5: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 5 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 5 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel5);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel5: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the next element with a level 6 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next level 6 heading element.
   *   await virtual.perform(virtual.commands.moveToNextHeadingLevel6);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextHeadingLevel6: (args: VirtualCommandArgs) => number | null;
  /**
   * Move to the previous element with a level 6 [`heading`](https://www.w3.org/TR/wai-aria-1.2/#heading)
   * role:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous level 6 heading element.
   *   await virtual.perform(virtual.commands.moveToPreviousHeadingLevel6);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousHeadingLevel6: (args: VirtualCommandArgs) => number | null;
}

const headingLevelNavigationCommands: HeadingLevelNavigationCommands =
  headingLevels.reduce((accumulatedCommands, headingLevel) => {
    const moveToNextCommand = `moveToNextHeadingLevel${headingLevel}`;
    const moveToPreviousCommand = `moveToPreviousHeadingLevel${headingLevel}`;

    return {
      ...accumulatedCommands,
      [moveToNextCommand]: getNextIndexByRoleAndAttributes({
        ariaAttributes: { "aria-level": headingLevel },
      }),
      [moveToPreviousCommand]: getPreviousIndexByRoleAndAttributes({
        ariaAttributes: { "aria-level": headingLevel },
      }),
    };
  }, {}) as {
    [K in
      | `moveToNextHeadingLevel${HeadingLevel}`
      | `moveToPreviousHeadingLevel${HeadingLevel}`]: (
      args: VirtualCommandArgs
    ) => number | null;
  };

export const commands = {
  /**
   * Jump to an element controlled by the current element in the Virtual Screen
   * Reader focus. See [aria-controls](https://www.w3.org/TR/wai-aria-1.2/#aria-controls).
   *
   * When using with `virtual.perform()`, pass an index option to select which
   * controlled element is jumped to when there are more than one:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to jump to the second controlled element.
   *   await virtual.perform(virtual.commands.jumpToControlledElement, { index: 1 });
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  jumpToControlledElement,
  /**
   * Jump to an element that describes the current element in the Virtual
   * Screen Reader focus. See [aria-details](https://www.w3.org/TR/wai-aria-1.2/#aria-details).
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to jump to the details element.
   *   await virtual.perform(virtual.commands.jumpToDetailsElement);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  jumpToDetailsElement,
  /**
   * Jump to an element that provides an error message for the current element
   * in the Virtual Screen Reader focus. See [aria-errormessage](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage).
   *
   * When using with `virtual.perform()`, pass an `index` option to select
   * which error message element is jumped to when there are more than one:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to jump to the second error message element.
   *   await virtual.perform(virtual.commands.jumpToErrorMessageElement, {
   *     index: 1,
   *   });
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  jumpToErrorMessageElement,
  /**
   * Move to the next element in an alternate reading order. See
   * [aria-flowto](https://www.w3.org/TR/wai-aria-1.2/#aria-flowto).
   *
   * When using with `virtual.perform()`, pass an `index` option to select
   * which alternate reading order element is jumped to when there are more
   * than one:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the second choice element of next alternate reading order.
   *   await virtual.perform(
   *     virtual.commands.moveToNextAlternateReadingOrderElement,
   *     { index: 1 }
   *   );
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextAlternateReadingOrderElement,
  /**
   * Move to the previous element in an alternate reading order. See
   * [aria-flowto](https://www.w3.org/TR/wai-aria-1.2/#aria-flowto).
   *
   * When using with `virtual.perform()`, pass an `index` option to select
   * which alternate reading order element is jumped to when there are more than
   * one:
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the second choice element of previous alternate reading order.
   *   await virtual.perform(
   *     virtual.commands.moveToPreviousAlternateReadingOrderElement,
   *     { index: 1 }
   *   );
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousAlternateReadingOrderElement,
  ...quickAriaRoleNavigationCommands,
  /**
   * Move to the next element with any [`landmark`](https://www.w3.org/TR/wai-aria-1.2/#landmark)
   * role:
   *
   * - [`banner`](https://www.w3.org/TR/wai-aria-1.2/#banner)
   * - [`complementary`](https://www.w3.org/TR/wai-aria-1.2/#complementary)
   * - [`contentinfo`](https://www.w3.org/TR/wai-aria-1.2/#contentinfo)
   * - [`figure`](https://www.w3.org/TR/wai-aria-1.2/#figure)
   * - [`form`](https://www.w3.org/TR/wai-aria-1.2/#form)
   * - [`landmark`](https://www.w3.org/TR/wai-aria-1.2/#landmark)
   * - [`main`](https://www.w3.org/TR/wai-aria-1.2/#main)
   * - [`navigation`](https://www.w3.org/TR/wai-aria-1.2/#navigation)
   * - [`region`](https://www.w3.org/TR/wai-aria-1.2/#region)
   * - [`search`](https://www.w3.org/TR/wai-aria-1.2/#search)
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the next landmark element.
   *   await virtual.perform(virtual.commands.moveToNextLandmark);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToNextLandmark: getNextIndexByRoleAndAttributes({
    roles: quickLandmarkNavigationRoles,
  }),
  /**
   * Move to the previous element with any [`landmark`](https://www.w3.org/TR/wai-aria-1.2/#landmark)
   * role:
   *
   * - [`banner`](https://www.w3.org/TR/wai-aria-1.2/#banner)
   * - [`complementary`](https://www.w3.org/TR/wai-aria-1.2/#complementary)
   * - [`contentinfo`](https://www.w3.org/TR/wai-aria-1.2/#contentinfo)
   * - [`figure`](https://www.w3.org/TR/wai-aria-1.2/#figure)
   * - [`form`](https://www.w3.org/TR/wai-aria-1.2/#form)
   * - [`landmark`](https://www.w3.org/TR/wai-aria-1.2/#landmark)
   * - [`main`](https://www.w3.org/TR/wai-aria-1.2/#main)
   * - [`navigation`](https://www.w3.org/TR/wai-aria-1.2/#navigation)
   * - [`region`](https://www.w3.org/TR/wai-aria-1.2/#region)
   * - [`search`](https://www.w3.org/TR/wai-aria-1.2/#search)
   *
   * ```ts
   * import { virtual } from "@guidepup/virtual-screen-reader";
   *
   * test("example test", async () => {
   *   // Start the Virtual Screen Reader.
   *   await virtual.start({ container: document.body });
   *
   *   // Perform action to move to the previous landmark element.
   *   await virtual.perform(virtual.commands.moveToPreviousLandmark);
   *
   *   // Stop the Virtual Screen Reader.
   *   await virtual.stop();
   * });
   * ```
   */
  moveToPreviousLandmark: getPreviousIndexByRoleAndAttributes({
    roles: quickLandmarkNavigationRoles,
  }),
  ...headingLevelNavigationCommands,
};

export type VirtualCommands = {
  [K in keyof typeof commands]: (typeof commands)[K];
};
