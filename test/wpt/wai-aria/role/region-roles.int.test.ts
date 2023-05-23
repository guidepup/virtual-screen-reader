import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/region-roles.html
 *
 * Verifies Invalid Roles from https://w3c.github.io/aria/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors
 */

describe("Region Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- no label -->
    <nav role="region" data-testname="region without label" data-expectedrole="navigation" class="ex">x</nav>

    <!-- w/ label -->
    <nav role="region" data-testname="region with label" data-expectedrole="region" aria-label="x" class="ex">x</nav>
    `;

    await virtual.start({ container: document.body });

    // Navigation
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
      "navigation",
      "x",
      "end of navigation",
      "region, x",
    ]);
  });
});
