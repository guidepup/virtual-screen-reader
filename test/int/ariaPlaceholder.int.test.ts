import { virtual } from "../../src";

describe("Placeholder Attribute Property", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should announce a non-empty aria-placeholder attribute on an input when there is no value", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="" aria-placeholder="Search..."/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Label, placeholder Search..."
    );

    await virtual.stop();
  });

  it("should not announce an empty aria-placeholder attribute on an input when there is no value", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="" aria-placeholder=""/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("textbox, Label");

    await virtual.stop();
  });

  it("should announce an input value in preference to a non-empty aria-placeholder attribute", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="a11y" aria-placeholder="Search..."/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("textbox, Label, a11y");

    await virtual.stop();
  });

  it("should announce a non-empty placeholder attribute on an input when there is no value", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="" placeholder="Search..."/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Label, placeholder Search..."
    );

    await virtual.stop();
  });

  it("should not announce an empty placeholder attribute on an input when there is no value", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="" placeholder=""/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("textbox, Label");

    await virtual.stop();
  });

  it("should announce an input value in preference to a non-empty placeholder attribute", async () => {
    document.body.innerHTML = `
    <div id="label">Label</div>
    <input type="text" aria-labelledby="label" id="search1" value="a11y" placeholder="Search..."/>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("textbox, Label, a11y");

    await virtual.stop();
  });
});
