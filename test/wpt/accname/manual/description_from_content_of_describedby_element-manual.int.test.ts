import { virtual } from "../../../../src/index.js";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_from_content_of_describedby_element-manual.html
 */

describe("Description from content of describedby element", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <style>
      .hidden { display: none; }
    </style>
    <input id="test" type="text" aria-label="Important stuff" aria-describedby="descId" />
    <div>
      <div id="descId">
        <span aria-hidden="true"><i> Hello, </i></span>
        <span>My</span> name is
        <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>
        <span role="presentation" aria-label="Eli">
          <span aria-label="Garaventa">Zambino</span>
        </span>
        <span>the weird.</span>
        (QED)
        <span class="hidden"><i><b>and don't you forget it.</b></i></span>
        <table>
          <tr>
            <td>Where</td>
            <td style="visibility:hidden;"><div>in</div></td>
            <td><div style="display:none;">the world</div></td>
            <td>are my marbles?</td>
          </tr>
        </table>
      </div>
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

  test("tests description", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      // TODO: FAIL incorrectly using Zambino where it should be using Eli
      // Needs fix in https://github.com/eps1lon/dom-accessibility-api
      "textbox, Important stuff, My name is Zambino the weird. (QED) Where are my marbles?",
      "My",
      "name is",
      "Eli",
      "Garaventa",
      "Zambino",
      "the weird.",
      "(QED)",
      "table",
      "rowgroup",
      "row, Where are my marbles?, position 1, group size 1",
      "cell, Where",
      "cell",
      "cell, are my marbles?",
      "end of row, Where are my marbles?, position 1, group size 1",
      "end of rowgroup",
      "end of table",
      "end of document",
    ]);
  });
});
