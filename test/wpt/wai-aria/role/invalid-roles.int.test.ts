import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/invalid-roles.html
 *
 * Verifies Invalid Roles from https://w3c.github.io/aria/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors
 */

describe("Invalid Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <nav role="foo" data-testname="invalid role name foo" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="foo bar" data-testname="multiple invalid role names" data-expectedrole="navigation" class="ex">x</nav>
    `;

    await virtual.start({ container: document.body });

    for (let i = 0; i < document.body.querySelectorAll("nav").length * 3; i++) {
      await virtual.next();
    }
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("verifies roles", async () => {
    const expected = [
      ...new Array(document.body.querySelectorAll("nav").length),
    ].flatMap(() => ["navigation", "x", "end of navigation"]);

    expect(await virtual.spokenPhraseLog()).toEqual(["document", ...expected]);
  });
});
