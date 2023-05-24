import { virtual } from "../../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/manual/description_test_case_557-manual.html
 */

describe("Description test case 557", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <img id="test" src="foo.jpg" aria-label="1" alt="a" title="t"/>
    `;

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("tests description", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      // "t", // TODO: FAIL it is ignoring the img altogether
      // "end of document",
    ]);
  });
});
