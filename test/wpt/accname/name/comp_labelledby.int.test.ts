import { virtual } from "../../../../src/index.js";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_labelledby.html
 */

describe("Name Comp: Labelledby", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div role="group" aria-labelledby="h" class="ex" data-expectedlabel="div group label" data-testname="div group explicitly labelledby heading">
      <h2 id="h">div group label</h2>
      <p>text inside div group</p>
    </div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("tests accessible name", async () => {
    expect(await virtual.itemTextLog()).toEqual([
      "",
      "div group label",
      "div group label",
      "",
      "text inside div group",
      "",
      "div group label",
      "",
    ]);
  });
});
