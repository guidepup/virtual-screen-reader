import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_link-with-label-manual.html
 */

describe("Description link-with-label", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <a id="test" href="#" aria-label="California" title="San Francisco" >United States</a>
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
      "link, California, San Francisco",
      "United States",
      "end of link, California, San Francisco",
      "end of document",
    ]);
  });
});
