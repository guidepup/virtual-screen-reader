import { virtual } from "../../src";

describe("Aria Owns", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should handle an aria-owns single reference", async () => {
    document.body.innerHTML = `
    <ul id="target">
        <li aria-owns="child">Fruit</li>
        <li>Vegetables</li>
    </ul>

    <ul id="child">
        <li>Apples</li>
        <li>Bananas</li>
    </ul>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "list",
      "listitem",
      "Fruit",
      "list",
      "listitem",
      "Apples",
      "end of listitem",
      "listitem",
      "Bananas",
      "end of listitem",
      "end of list",
      "end of listitem",
      "listitem",
      "Vegetables",
      "end of listitem",
      "end of list",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle an aria-owns multiple reference", async () => {
    document.body.innerHTML = `
    <ul id="target">
      <li aria-owns="child1 child2">Fruit</li>
      <li>Vegetables</li>
    </ul>

    <ul id="child1">
        <li>Apples</li>
        <li>Bananas</li>
    </ul>

    <ul id="child2">
        <li>Blackberries</li>
        <li>Blueberries</li>
    </ul>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "list",
      "listitem",
      "Fruit",
      "list",
      "listitem",
      "Apples",
      "end of listitem",
      "listitem",
      "Bananas",
      "end of listitem",
      "end of list",
      "list",
      "listitem",
      "Blackberries",
      "end of listitem",
      "listitem",
      "Blueberries",
      "end of listitem",
      "end of list",
      "end of listitem",
      "listitem",
      "Vegetables",
      "end of listitem",
      "end of list",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns where used to reorder already owned children", async () => {
    document.body.innerHTML = `
    <div id="parent" aria-owns="child1 child4 child2">
      <div id="child1">Child 1</div>
      <div id="child2">Child 2</div>
      <div id="child3">Child 3</div>
      <div id="child4">Child 4</div>
    </div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Child 3",
      "Child 1",
      "Child 4",
      "Child 2",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns simple circular references gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2">Element 1</div>
    <div id="element2" aria-owns="element3">Element 2</div>
    <div id="element3" aria-owns="element2">Element 3</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "Element 2",
      "Element 3",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns only circular references gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2">Element 1</div>
    <div id="element2" aria-owns="element1">Element 2</div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    // All elements are "owned" by each other, so are ignored in the accessibility tree
    expect(await virtual.spokenPhraseLog()).toEqual(["document", "document"]);

    await virtual.stop();
  });

  it("should handle aria-owns complex circular references gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2">Element 1</div>
    <div id="element2" aria-owns="element4 element3">Element 2</div>
    <div id="element3">Element 3</div>
    <div id="element4" aria-owns="element5">Element 4</div>
    <div id="element5" aria-owns="element3">Element 5</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "Element 2",
      "Element 4",
      "Element 5",
      "Element 3",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns invalid IDREF gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2">Element 1</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns invalid IDREFs gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2 element3">Element 1</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle aria-owns IDREF for a hidden element gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element2">Element 1</div>
    <div id="element2" aria-hidden="true">Element 2</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle trying to find aria-owns on a non-element container", async () => {
    const textNode = document.createTextNode("text node");

    await virtual.start({ container: textNode as unknown as HTMLElement });

    expect(await virtual.spokenPhraseLog()).toEqual(["text node"]);

    await virtual.stop();
  });

  it("should handle multiple aria-owns for the same IDREF gracefully", async () => {
    document.body.innerHTML = `
    <div id="element1" aria-owns="element3">Element 1</div>
    <div id="element2" aria-owns="element3">Element 2</div>
    <div id="element3">Element 3</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Element 1",
      "Element 3",
      "Element 2",
      "end of document",
    ]);

    await virtual.stop();
  });
});
