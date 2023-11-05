import { virtual } from "../../../..";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/list-roles.html
 *
 * Verifies Invalid Roles from https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
 * 9.1 Roles - handling author errors
 */

describe("List-related Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div role="list" data-testname="first simple list" data-expectedrole="list" class="ex">
      <div role="listitem" data-testname="first simple listitem" data-expectedrole="listitem" class="ex">x</div>
      <div role="listitem" data-testname="last simple listitem" data-expectedrole="listitem" class="ex">x</div>
    </div>
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
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "list",
      "listitem",
      "x",
      "end of listitem",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
    ]);
  });
});
