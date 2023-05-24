import { setupBasicPage } from "../utils";
import { virtual } from "../../src";

describe("next", () => {
  beforeEach(async () => {
    setupBasicPage();

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should move through the next elements", async () => {
    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.itemTextLog()).toEqual([
      "",
      "",
      "Nav Text",
      "",
      "",
      "Section Heading 1",
      "Section Text",
      "",
      "",
      "Article Header Heading 1",
      "Article Header Text",
      "",
      "Article Text",
      "",
      "",
      "",
      "Footer",
      "",
      "",
    ]);

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "Nav Text",
      "end of navigation",
      "region",
      "heading, Section Heading 1",
      "Section Text",
      "article",
      "banner",
      "heading, Article Header Heading 1",
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
  });
});
