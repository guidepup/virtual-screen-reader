import { virtual } from "../../../../src/index.js";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_embedded_control.html
 */

describe("Name Comp: Embedded Control", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <label>
      <input type="checkbox" data-expectedlabel="Flash the screen 3 times" data-testname="checkbox label with embedded textfield" class="ex">
      Flash the screen
      <input value="3" aria-label="number of times" data-expectedlabel="number of times" data-testname="label of embedded textfield inside checkbox label" class="ex"> times
    </label>
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
      "Flash the screen 3 times",
      "Flash the screen",
      "number of times, 3",
      "times",
      "",
    ]);
  });
});
