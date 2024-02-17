import { virtual } from '../../src/index.js';

describe("jumpToDetailsElement", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should jump to a details element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-details="controls-target">Target</button>
    <div>content 1</div>
    <ul id="controls-target">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);
    await virtual.next();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, linked details",
      "list",
      "listitem",
      "Item 1",
    ]);

    await virtual.stop();
  });

  it("should jump to a details presentation element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-details="controls-target">Target</button>
    <div>content 1</div>
    <div id="controls-target">content 2</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, linked details",
      "content 2",
    ]);

    await virtual.stop();
  });

  it("should handle a non-element container gracefully", async () => {
    const container = document.createTextNode("text node");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual(["text node"]);

    await virtual.stop();
  });

  it("should handle a hidden container gracefully", async () => {
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");

    await virtual.start({ container });
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });

  it("should ignore the command on a non-element node", async () => {
    document.body.innerHTML = `Hello World`;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Hello World",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with no aria-details", async () => {
    document.body.innerHTML = `
    <button id="target">Target</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an invalid aria-details", async () => {
    document.body.innerHTML = `
    <button id="target" aria-details="missing-element">Target</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target",
    ]);

    await virtual.stop();
  });

  it("should ignore the command on an element with an aria-details pointing to a hidden element", async () => {
    document.body.innerHTML = `
    <button id="target" aria-details="hidden-element">Target</button>
    <div id="hidden-element" aria-hidden="true">Hidden</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.perform(virtual.commands.jumpToDetailsElement);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Target, linked details",
    ]);

    await virtual.stop();
  });
});
