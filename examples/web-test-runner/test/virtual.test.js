import { expect } from "@esm-bundle/chai";
import "../src/index.js";

afterEach(async () => {
  await window.virtual.stop();

  document.body.innerHTML = "";
});

it("renders a heading and a paragraph", async () => {
  while ((await window.virtual.lastSpokenPhrase()) !== "end of document") {
    await window.virtual.next();
  }

  expect(await window.virtual.spokenPhraseLog()).to.eql([
    "document",
    "navigation",
    "Nav Text",
    "end of navigation",
    "region",
    "heading, Section Heading 1, level 1",
    "paragraph",
    "Section Text",
    "end of paragraph",
    "article",
    "heading, Article Header Heading 1, level 1",
    "paragraph",
    "Article Header Text",
    "end of paragraph",
    "paragraph",
    "Article Text",
    "end of paragraph",
    "end of article",
    "end of region",
    "contentinfo",
    "Footer",
    "end of contentinfo",
    "end of document",
  ]);
});
