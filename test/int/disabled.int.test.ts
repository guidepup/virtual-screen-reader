import { virtual } from "../../src";

describe("Checked Attribute State", () => {
  afterEach(async () => {
    document.body.innerHTML = "";
  });

  it("should announce that a button with an aria-disabled attribute set to true is 'disabled'", async () => {
    document.body.innerHTML = `
    <button aria-disabled="true">Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Submit, disabled");

    await virtual.stop();
  });

  it("should announce a button with an aria-disabled attribute set to false without any disabled state labelling", async () => {
    document.body.innerHTML = `
    <button aria-disabled="false">Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "button, Submit, not disabled"
    );

    await virtual.stop();
  });

  it("should announce that a button with a disabled attribute", async () => {
    document.body.innerHTML = `
    <button disabled>Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Submit, disabled");

    await virtual.stop();
  });

  it("should announce that a button with a disabled attribute set to true is 'disabled'", async () => {
    document.body.innerHTML = `
    <button disabled="true">Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Submit, disabled");

    await virtual.stop();
  });

  it("should announce a button with a disabled attribute set to false without any disabled state labelling", async () => {
    document.body.innerHTML = `
    <button disabled="false">Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "button, Submit, not disabled"
    );

    await virtual.stop();
  });

  it("should announce a button without an aria-disabled attribute without any disabled state labelling", async () => {
    document.body.innerHTML = `
    <button>Submit</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Submit");

    await virtual.stop();
  });
});
