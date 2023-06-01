import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_test_case_665-manual.html
 */

describe("Description test case 665", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div>
      <img id="test" aria-describedby="ID1" src="test.png">
    </div>
    <div id="ID1" style="display:none">foo</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("tests description", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "img, foo",
      "end of document",
    ]);
  });
});
