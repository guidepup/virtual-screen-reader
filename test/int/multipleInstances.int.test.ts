import { setupBasicPage } from "../utils.js";
import { Virtual } from "../../src/index.js";

const virtual1 = new Virtual();
const virtual2 = new Virtual();

describe("Multiple Instances", () => {
  beforeEach(async () => {
    setupBasicPage();

    await virtual1.start({ container: document.body });
    await virtual2.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual1.stop();
    await virtual2.stop();

    document.body.innerHTML = "";
  });

  it("should allow you to use two virtual screen readers on the same DOM at the same time", async () => {
    while ((await virtual1.lastSpokenPhrase()) !== "end of document") {
      await virtual1.next();
    }

    await virtual2.previous();
    while ((await virtual2.lastSpokenPhrase()) !== "document") {
      await virtual2.previous();
    }

    expect(await virtual1.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "Nav Text",
      "end of navigation",
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
      "contentinfo",
      "Footer",
      "end of contentinfo",
      "end of document",
    ]);

    expect(await virtual2.spokenPhraseLog()).toEqual([
      "document",
      "end of document",
      "end of contentinfo",
      "Footer",
      "contentinfo",
      "end of article",
      "end of paragraph",
      "Article Text",
      "paragraph",
      "end of paragraph",
      "Article Header Text",
      "paragraph",
      "heading, Article Header Heading 1, level 1",
      "article",
      "end of paragraph",
      "Section Text",
      "paragraph",
      "heading, Section Heading 1, level 1",
      "end of navigation",
      "Nav Text",
      "navigation",
      "document",
    ]);
  });
});
