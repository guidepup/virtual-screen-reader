import { virtual } from '../../../../src/index.js';

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_test_case_666-manual.html
 */

describe("Description test case 666", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div>
      <img id="test" aria-describedby="ID1" src="test.png">
    </div>
    <div id="ID1" role="presentation">foo</div>
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
      "img, foo",
      "foo",
      "end of document",
    ]);
  });
});
