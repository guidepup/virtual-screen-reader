import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/fallback-roles.html
 *
 * Verifies Fallback Roles from https://w3c.github.io/aria/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors
 */

describe("Fallback Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <navigation role="region group" data-testname="fallback role w/ region with no label" data-expectedrole="group" class="ex">x</navigation>
    <navigation role="region group" data-testname="fallback role w/ region with label" aria-label="x" data-expectedrole="region" class="ex">x</navigation>
    `;

    await virtual.start({ container: document.body });

    // Group
    await virtual.next();
    await virtual.next();

    // Region
    await virtual.next();
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "group",
      "x",
      "end of group",
      "region, x",
    ]);
  });
});
