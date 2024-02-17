import { virtual } from '../../../../src/index.js';

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_test_case_773-manual.html
 */

describe("Description test case 773", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <img src="foo.jpg" id="test" alt="test" aria-describedby="t1">
    <div id="t1" style="display:none">foo</div>
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
      "img, test, foo",
      "end of document",
    ]);
  });
});
