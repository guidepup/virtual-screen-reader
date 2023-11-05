import { virtual } from "../../../..";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/region-roles.html
 *
 * Verifies Invalid Roles from https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
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
    await virtual.next();

    // Navigation
    await virtual.next();
    await virtual.next();

    // Region
    await virtual.next();
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "x",
      "end of navigation",
      "region, x",
    ]);
  });
});
