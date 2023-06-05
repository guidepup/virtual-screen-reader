import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/role_none_conflict_resolution.html
 *
 * Verifies https://w3c.github.io/aria/#conflict_resolution_presentation_none
 * conflict resolution requirements for the ARIA none and presentation roles.
 */

describe("Role None Conflict Resolution Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- none with label(global) on header -->
    <h1 role="none" data-testname="heading role none with global attr aria-label" data-expectedrole="heading" aria-label="x" class="ex">x</h1>

    <!-- none with label(global) on paragraph -->
    <p role="none" data-testname="p role none with global attr aria-label (prohibited role)" data-expectedrole="paragraph" aria-label="x" class="ex">x</p>
    <p role="none" data-testname="p role none without global attr aria-label (prohibited role)" data-expectedrole="none" class="ex">x</p>

    <!-- none with focusable header -->
    <h1 role="none" data-testname="focusable heading role none with tabindex=0" data-expectedrole="heading" tabindex="0" class="ex">x</h1>
    <h1 role="none" data-testname="focusable heading role none with tabindex=-1" data-expectedrole="heading" tabindex="-1" class="ex">x</h1>
    <h1 role="none" data-testname="non-focusable heading role none" data-expectedrole="none" class="ex">x</h1>

    <!-- none with non-global-->
    <h1 role="none" data-testname="none with non-global" data-expectedrole="none" class="ex" aria-level="2"> Sample Content </h1>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, x, level 1",
      /**
       * Invalid as of Aria 1.2, see https://www.w3.org/TR/wai-aria-1.2/#paragraph.
       * Awaiting new release of dom-accessibility-api / aria-query dependencies
       * "paragraph, x"
       */
      "x",
      "x",
      "heading, level 1",
      "x",
      "end of heading, level 1",
      "heading, level 1",
      "x",
      "end of heading, level 1",
      "x",
      "Sample Content",
    ]);
  });
});
