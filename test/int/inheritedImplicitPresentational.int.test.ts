import { virtual } from "../../src/index.js";

describe("Inherited Implicit Presentational Role", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should treat children of presentation roles as presentation when there are no exceptions", async () => {
    document.body.innerHTML = `
    <!-- 1. role="presentation" negates the implicit 'heading' role semantics but does not affect the contents, including the nested hyperlink. -->
    <h1 role="presentation"> Sample Content <a href="...">let's go!</a> </h1>

    <!-- 2. A span has an implicit 'generic' role and no other attributes important to accessibility, so only its content is exposed, including the hyperlink. -->
    <span> Sample Content <a href="...">let's go!</a> </span>

    <!-- 3. In the following code sample, the containing img and is appropriately labeled by the caption paragraph. In this example the img element can be marked as presentation because the role and the text alternatives are provided by the containing element. -->
    <div role="img" aria-labelledby="caption">
      <img src="example.png" role="presentation" alt="">
      <p id="caption">A visible text caption labeling the image.</p>
    </div>

    <!-- 4. In the following code sample, because the anchor (HTML a element) is acting as the treeitem, the list item (HTML li element) is assigned an explicit WAI-ARIA role of presentation to override the user agent's implicit native semantics for list items. -->
    <ul role="tree">
      <li role="presentation">
        <a role="treeitem" aria-expanded="true">An expanded tree node</a>
      </li>
    </ul>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.itemTextLog()).toEqual([
      "",
      "Sample Content",
      "let's go!",
      "Sample Content",
      "let's go!",
      "A visible text caption labeling the image.",
      "",
      "An expanded tree node",
      "",
      "",
    ]);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Sample Content",
      "link, let's go!",
      "Sample Content",
      "link, let's go!",
      "img, A visible text caption labeling the image.",
      "tree, orientated vertically",
      "treeitem, An expanded tree node, expanded, not selected",
      "end of tree, orientated vertically",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle inherited implicit presentation role", async () => {
    document.body.innerHTML = `
    <ul role="presentation">
      <li> Sample Content </li>
      <li> More Sample Content </li>
    </ul>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Sample Content",
      "More Sample Content",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle no implicit roles", async () => {
    document.body.innerHTML = `
    <foo>
      <foo> Sample Content </foo>
      <foo> More Sample Content </foo>
    </foo>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Sample Content",
      "More Sample Content",
      "end of document",
    ]);

    await virtual.stop();
  });
});
