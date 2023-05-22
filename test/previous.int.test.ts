import { setupBasicPage } from "./utils";
import { virtual } from "../src";

describe("next", () => {
  beforeEach(() => {
    setupBasicPage();
  });

  it("should move through previous elements", async () => {
    await virtual.start({ container: document.body });

    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();
    await virtual.previous();

    expect(await virtual.itemTextLog()).toEqual([
      "Footer",
      "Article Text",
      "Article Header Text",
      "Article Header Heading 1",
      "",
      "",
      "Section Text",
      "Section Heading 1",
      "Nav Text",
    ]);
    expect(await virtual.spokenPhraseLog()).toEqual([
      "contentinfo, Footer",
      "Article Text",
      "Article Header Text",
      "heading, Article Header Heading 1",
      "banner",
      "article",
      "Section Text",
      "heading, Section Heading 1",
      "navigation, Nav Text",
    ]);

    await virtual.stop();
  });
});
