import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_test_case_broken_reference-manual.html
 */

describe("Description test case broken reference", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <img src="foo.jpg" id="test" alt="test" aria-describedby="t1">
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
      "img, test",
      "end of document",
    ]);
  });
});
