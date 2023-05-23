import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/form-roles.html
 *
 * Verifies https://w3c.github.io/aria/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors and the form role.
 */

describe("Form Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- no label -->
    <nav role="form" data-testname="form without label" data-expectedrole="navigation" class="ex">x</nav>
    
    <!-- w/ label -->
    <nav role="form" data-testname="form with label" data-expectedrole="form" aria-label="x" class="ex">x</nav>
    `;

    await virtual.start({ container: document.body });

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
      "navigation",
      "x",
      "end of navigation",
      "form, x",
    ]);
  });
});
