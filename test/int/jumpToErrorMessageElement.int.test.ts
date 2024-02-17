import { virtual } from '../../src/index.js';

describe("jumpToErrorMessageElement", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should jump to an error message element", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg" aria-invalid="true" value="" >
    <div id="invalid-true-msg">example error text</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", 1 error message, invalid',
      "example error text",
    ]);
  });

  it("should jump to the second error message element", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg-1 invalid-true-msg-2" aria-invalid="true" value="" >
    <div id="invalid-true-msg-1">first example error text</div>
    <div id="invalid-true-msg-2">second example error text</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement, {
      index: 1,
    });

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", 2 error messages, invalid',
      "second example error text",
    ]);
  });

  it("should jump to an error message presentation element", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg-1 invalid-true-msg-2" aria-invalid="true" value="" >
    <div id="invalid-true-msg-1" role="presentation">first example error text</div>
    <div id="invalid-true-msg-2" role="presentation">second example error text</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", 2 error messages, invalid',
      "first example error text",
    ]);
  });

  it("should jump to a second error message presentation element", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg-1 invalid-true-msg-2" aria-invalid="true" value="" >
    <div id="invalid-true-msg-1" role="presentation">first example error text</div>
    <div id="invalid-true-msg-2" role="presentation">second example error text</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement, {
      index: 1,
    });

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", 2 error messages, invalid',
      "second example error text",
    ]);
  });

  it("should handle a non-element container gracefully", async () => {
    const container = document.createTextNode("text node");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual(["text node"]);

    await virtual.stop();
  });

  it("should handle a hidden container gracefully", async () => {
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });

  it("should ignore the command on a non-element node", async () => {
    document.body.innerHTML = `Hello World`;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Hello World",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with no aria-errormessage", async () => {
    document.body.innerHTML = `
    <button id="target">Target</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an invalid aria-errormessage", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="missing-element" aria-invalid="true" value="" >
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", invalid',
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an aria-errormessage pointing to a hidden element", async () => {
    document.body.innerHTML = `
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg" aria-invalid="true" value="" >
    <div id="invalid-true-msg" aria-hidden="true">example error text</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToErrorMessageElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'Input with aria-invalid="true"',
      'textbox, Input with aria-invalid="true", 1 error message, invalid',
    ]);
  });
});
