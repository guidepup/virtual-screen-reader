import { setupBasicPage } from "../utils";
import { virtual } from "../../src";

describe("previous", () => {
  beforeEach(async () => {
    setupBasicPage();

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should move through previous elements", async () => {
    await virtual.previous();

    while ((await virtual.lastSpokenPhrase()) !== "document") {
      await virtual.previous();
    }

    expect(await virtual.itemTextLog()).toEqual([
      "",
      "",
      "",
      "Footer",
      "",
      "",
      "",
      "Article Text",
      "",
      "Article Header Text",
      "Article Header Heading 1",
      "",
      "",
      "Section Text",
      "Section Heading 1",
      "",
      "",
      "Nav Text",
      "",
      "",
    ]);

    expect(await virtual.spokenPhraseLog()).toEqual([
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
      "heading, Article Header Heading 1",
      "banner",
      "article",
      "Section Text",
      "heading, Section Heading 1",
      "region",
      "end of navigation",
      "Nav Text",
      "navigation",
      "document",
    ]);
  });
});
