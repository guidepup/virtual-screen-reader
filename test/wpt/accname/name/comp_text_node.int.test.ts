import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/name/comp_text_node.html
 */

describe("Name Comp: Text Node", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- Skipped (class="ex" removed) until https://github.com/w3c/accname/issues/193 is resolved -->
    <h2 class="ex-skipped" data-expectedlabel="heading label" data-testname="heading with text/comment/text nodes, no space">
      heading<!-- with non-text node splitting concatenated text nodes -->label<!-- [sic] no extra spaces around first comment -->
    </h2>


    <h2 class="ex" data-expectedlabel="heading label" data-testname="heading with text/comment/text nodes, with space">
      heading
      <!-- comment node between text nodes with leading/trailing whitespace -->
      label
    </h2>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("tests accessible name", async () => {
    expect(await virtual.itemTextLog()).toEqual([
      "",
      "headinglabel", // TODO: FAIL should have whitespace
      "heading label",
      "heading", // TODO: FAIL should be same node
      "label",
      "heading label",
      "",
    ]);
  });
});
