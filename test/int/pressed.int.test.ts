import { virtual } from "../../src";

describe("Checked Attribute State", () => {
  afterEach(async () => {
    document.body.innerHTML = "";
  });

  it("should announce that a button with an aria-pressed attribute set to true is 'pressed'", async () => {
    document.body.innerHTML = `
    <button aria-pressed="true">Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause, pressed");

    await virtual.stop();
  });

  it("should announce that a button with an aria-pressed attribute set to false is 'not pressed'", async () => {
    document.body.innerHTML = `
    <button aria-pressed="false">Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause, not pressed");

    await virtual.stop();
  });

  it("should announce a button without an aria-pressed attribute without any pressed state labelling", async () => {
    document.body.innerHTML = `
    <button>Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause");

    await virtual.stop();
  });
});
