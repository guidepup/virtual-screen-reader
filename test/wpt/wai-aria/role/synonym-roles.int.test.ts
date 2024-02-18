import { virtual } from "../../../../src/index.js";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/synonym-roles.html
 *
 * spec resolution https://github.com/w3c/core-aam/issues/166
 */

describe("Synonym Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div role="none" id="none" data-expectedrole="none" data-testname="none role == computedrole none" class="ex">x</div><!-- preferred -->
    <div role="presentation" id="presentation" data-expectedrole="none" data-testname="synonym presentation role == computedrole none" class="ex">x</div><!-- synonym -->

    <!-- image role due ARIA 1.3 -->
    <!-- <div role="image" id="image" data-expectedrole="image" data-testname="image role == computedrole image" class="ex">x</div> --> <!-- preferred -->
    <div role="img" id="img" data-expectedrole="image" data-testname="synonym img role == computedrole image" class="ex">x</div><!-- synonym -->

    <!-- \`directory\` synonym deprecated in ARIA 1.2; these examples should all return computedrole \`list\` -->
    <ul role="list" id="list2" data-expectedrole="list" data-testname="list role == computedrole list" class="ex"><li>x</li></ul>
    <ul role="directory" id="directory" data-expectedrole="list" data-testname="directory role == computedrole list" class="ex"><li>x</li></ul>
    <div role="directory" id="div" data-expectedrole="list" data-testname="div w/directory role == computedrole list" class="ex"><div role="listitem">x</div></div>
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
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "x",
      "x",
      "img",
      "x",
      "end of img",
      "list",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      /**
       * `directory` alias deprecated in https://www.w3.org/TR/wai-aria-1.2/#directory
       */
      "directory",
      "listitem",
      "x",
      "end of listitem",
      "end of directory",
      "directory",
      "listitem",
      "x",
      "end of listitem",
      "end of directory",
    ]);
  });
});
