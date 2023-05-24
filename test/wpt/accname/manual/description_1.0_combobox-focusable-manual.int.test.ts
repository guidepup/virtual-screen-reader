import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_1.0_combobox-focusable-manual.html
 */

describe("Description 1.0 combobox-focusable", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div id="test" role="combobox" tabindex="0" title="Choose your language.">
      <span> English </span>
    </div>
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

  test("tests description", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "combobox, Choose your language.",
      "English",
      "end of combobox, Choose your language.",
      "end of document",
    ]);
  });
});
