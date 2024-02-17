import { virtual } from '../../../src/index.js';

/**
 * https://github.com/web-platform-tests/wpt/blob/master/accname/basic.html
 */

describe("Basic Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div id='d' style='height: 100px; width: 100px' role="group" aria-label="test label"></div>
    <h1 id="h">test heading</h1>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("tests label accessible name", async () => {
    expect(await virtual.itemText()).toEqual("test label");
  });

  test("tests heading accessible name", async () => {
    await virtual.next();

    expect(await virtual.itemText()).toEqual("test heading");
  });
});
