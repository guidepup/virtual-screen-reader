/* eslint-disable @typescript-eslint/no-require-imports */
(window.MutationObserver as unknown) = undefined;
const { virtual } = require("../../src");

describe("No Mutation Observer", () => {
  it("should handle DOM implementations that do not support Mutation Observer", async () => {
    document.body.innerHTML = `
    <div>Some Text</div>
    `;
    await virtual.start({ container: document.body });

    await virtual.next();

    expect(await virtual.itemText()).toEqual("Some Text");
    expect(await virtual.lastSpokenPhrase()).toEqual("Some Text");

    await virtual.stop();

    document.body.innerHTML = "";
  });
});
