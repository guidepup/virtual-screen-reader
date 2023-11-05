import { virtual } from "../..";

describe("jumpToControlledElement", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should jump to a controlled element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="controls-target">Target</button>
    <div>content 1</div>
    <ul id="controls-target">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);
    await virtual.next();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, 1 control",
      "list",
      "listitem",
      "Item 1",
    ]);

    await virtual.stop();
  });

  it("should jump to the second controlled element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="controls-target1 controls-target2">Target</button>
    <div>content 1</div>
    <ul id="controls-target1">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <ul id="controls-target2">
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement, {
      index: 1,
    });
    await virtual.next();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, 2 controls",
      "list",
      "listitem",
      "Item 3",
    ]);

    await virtual.stop();
  });

  it("should jump to a controlled presentation element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="controls-target">Target</button>
    <div>content 1</div>
    <div id="controls-target">content 2</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, 1 control",
      "content 2",
    ]);

    await virtual.stop();
  });

  it("should jump to a second controlled presentation element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="controls-target1 controls-target2">Target</button>
    <div>content 1</div>
    <div id="controls-target1">content 2</div>
    <div id="controls-target2">content 3</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement, {
      index: 1,
    });

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, 2 controls",
      "content 3",
    ]);

    await virtual.stop();
  });

  it("should handle a non-element container gracefully", async () => {
    const container = document.createTextNode("text node");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual(["text node"]);

    await virtual.stop();
  });

  it("should handle a hidden container gracefully", async () => {
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });

  it("should ignore the command on a non-element node", async () => {
    document.body.innerHTML = `Hello World`;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Hello World",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with no aria-controls", async () => {
    document.body.innerHTML = `
    <button id="target">Target</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an invalid aria-controls", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="missing-element">Target</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an aria-controls pointing to a hidden element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-controls="hidden-element">Target</button>
    <div id="hidden-element" aria-hidden="true">Hidden</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToControlledElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, 1 control",
    ]);

    await virtual.stop();
  });
});
