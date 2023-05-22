import { setupBasicPage } from "./utils";
import { virtual } from "../src";

describe("next", () => {
  beforeEach(() => {
    setupBasicPage();
  });

  it("should move through the next elements", async () => {
    await virtual.start({ container: document.body });

    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.itemTextLog()).toEqual([
      "Nav Text",
      "Section Heading 1",
      "Section Text",
      "",
      "",
      "Article Header Heading 1",
      "Article Header Text",
      "Article Text",
      "Footer",
    ]);
    expect(await virtual.spokenPhraseLog()).toEqual([
      "navigation, Nav Text",
      "heading, Section Heading 1",
      "Section Text",
      "article",
      "banner",
      "heading, Article Header Heading 1",
      "Article Header Text",
      "Article Text",
      "contentinfo, Footer",
    ]);

    await virtual.stop();
  });
});
