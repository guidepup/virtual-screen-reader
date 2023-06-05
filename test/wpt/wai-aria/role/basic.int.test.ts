import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/basic.html
 */

describe("Basic Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div id='d' style='height: 100px; width: 100px' role="group" aria-label="test label"></div>
    <h1 id="h">test heading</h1>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("tests explicit role", async () => {
    expect(await virtual.lastSpokenPhrase()).toEqual("group, test label");
  });

  test("tests implicit role", async () => {
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toEqual(
      "heading, test heading, level 1"
    );
  });
});
