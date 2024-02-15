import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_host_language_label.html
 */

describe("Name Comp: Host Language Label", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <label for="t">label</label>
    <input id="t" data-expectedlabel="label" data-testname="host language: label[for] input[type=text]" class="ex">
    <!-- Todo: test all remaining input types with label[for] -->

    <label>
      <input type="checkbox" data-expectedlabel="label" data-testname="host language: label input[type=checkbox] encapsulation" class="ex">
      label
    </label>
    <!-- Todo: test all remaining input types with label encapsulation -->
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
      "label",
      "label",
      "label",
      "label",
      "",
    ]);
  });
});
