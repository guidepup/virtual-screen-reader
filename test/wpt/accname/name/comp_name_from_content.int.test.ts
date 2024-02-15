import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_name_from_content.html
 */

describe("Name Comp: Name From Content", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <h1 data-expectedlabel="label" data-testname="heading name from content" class="ex">label</h1>
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
    expect(await virtual.itemTextLog()).toEqual(["", "label", ""]);
  });
});
