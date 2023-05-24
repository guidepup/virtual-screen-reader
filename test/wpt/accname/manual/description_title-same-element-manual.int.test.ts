import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_title-same-element-manual.html
 */

describe("Description title-same-element", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div><input aria-label="Name" id="test" title="Title" aria-describedby="ID1" type="text"></div>
    <div id="ID1">Description</div>
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
      "textbox, Name, Description",
      "Description",
      "end of document",
    ]);
  });
});
