import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/abstract-roles.html
 *
 * Verifies https://w3c.github.io/aria/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors
 */

describe("Abstract Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <nav role="command" data-testname="command role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="composite" data-testname="composite role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="input" data-testname="input role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="landmark" data-testname="landmark role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="range" data-testname="range role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="roletype" data-testname="roletype role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="section" data-testname="section role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="sectionhead" data-testname="sectionhead role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="select" data-testname="select role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="structure" data-testname="structure role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="widget" data-testname="widget role" data-expectedrole="navigation" class="ex">x</nav>
    <nav role="window" data-testname="window role" data-expectedrole="navigation" class="ex">x</nav>
    `;

    await virtual.start({ container: document.body });

    for (
      let i = 0;
      i < document.body.querySelectorAll("nav").length * 3 - 1;
      i++
    ) {
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

    expect(await virtual.spokenPhraseLog()).toEqual(expected);
  });
});
