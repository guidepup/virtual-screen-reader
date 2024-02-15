import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_hidden_not_referenced.html
 */

describe("Name Comp: Hidden Not Referenced", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <h2 class="ex" data-expectedlabel="heading label" data-testname="heading with interior hidden node">
      heading
      <span hidden>bogus</span>
      label
    </h2>
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
      "heading label",
      "heading", // TODO: this isn't ideal, probably should just omit the contents as it matches the parent (but slight owing to the bogus element)
      "label",
      "heading label",
      "",
    ]);
  });
});
