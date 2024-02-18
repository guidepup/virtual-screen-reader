import { virtual } from "../../src/index.js";

describe("Read only Attribute State", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce that a button with an aria-readonly attribute set to true is 'read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <div
      role="textbox"
      aria-labelledby="label"
      aria-readonly="true"
      id="email1"></div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with an aria-readonly attribute set to false is 'not read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <div
      role="textbox"
      aria-labelledby="label"
      aria-readonly="false"
      id="email1"></div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, not read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with a readonly attribute is 'read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      readonly
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with a readonly attribute set to true is 'read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      readonly="true"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with a readonly attribute set to false is 'not read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      readonly="false"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, not read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with a contenteditable attribute is 'not read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      contenteditable
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, not read only"
    );

    await virtual.stop();
  });
  it("should announce that a button with a contenteditable attribute set to true is 'not read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      contenteditable="true"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, not read only"
    );

    await virtual.stop();
  });

  it("should announce that a button with a contenteditable attribute set to false is 'read only'", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      contenteditable="false"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });

  it("should prefer contenteditable over aria-readonly", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      contenteditable="true"
      aria-readonly="true"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, not read only"
    );

    await virtual.stop();
  });

  it("should prefer readonly over aria-readonly", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      readonly="true"
      aria-readonly="false"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });

  it("should prefer readonly over contenteditable", async () => {
    document.body.innerHTML = `
    <div id="label">Email Address *</div>
    <textarea
      aria-labelledby="label"
      readonly="true"
      contenteditable="true"
      id="email1"></textarea>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "textbox, Email Address *, read only"
    );

    await virtual.stop();
  });
});
