import { virtual } from "../../src/index.js";

describe("Implicit Aria States", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce implicit aria states as labels", async () => {
    document.body.innerHTML = `
    <div role="tab">A Tab</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "tab, A Tab, position 1, set size 1, not selected"
    );

    await virtual.stop();
  });
});
