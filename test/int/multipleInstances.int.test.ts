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
      "region",
      "heading, Section Heading 1, level 1",
      "Section Text",
      "article",
      "banner",
      "heading, Article Header Heading 1, level 1",
      "Article Header Text",
      "end of banner",
      "Article Text",
      "end of article",
      "end of region",
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
      "end of region",
      "end of article",
      "Article Text",
      "end of banner",
      "Article Header Text",
      "heading, Article Header Heading 1, level 1",
      "banner",
      "article",
      "Section Text",
      "heading, Section Heading 1, level 1",
      "region",
      "end of navigation",
      "Nav Text",
      "navigation",
      "document",
    ]);
  });
});
