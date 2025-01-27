import { getByTestId, queryByTestId } from "@testing-library/dom";
import { setupBasicPage } from "../utils.js";
import { virtual } from "../../src/index.js";

describe("Visual Cursor", () => {
  describe("when a document is available", () => {
    beforeEach(async () => {
      setupBasicPage();

      await virtual.start({ container: document.body, displayCursor: true });
    });

    afterEach(async () => {
      await virtual.stop();

      document.body.innerHTML = "";
    });

    it("should add a visual cursor element to the container", async () => {
      expect(
        getByTestId(document.body, "virtual-screen-reader-cursor")
      ).toBeInTheDocument();
    });

    it("should move through the next elements with a visual cursor", async () => {
      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.itemTextLog()).toEqual([
        "",
        "",
        "Nav Text",
        "",
        "Section Heading 1",
        "",
        "Section Text",
        "",
        "",
        "Article Header Heading 1",
        "",
        "Article Header Text",
        "",
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
    });
  });

  describe("when a document is not available", () => {
    beforeEach(async () => {
      setupBasicPage();

      await virtual.start({
        container: document.body,
        displayCursor: true,
        window: {},
      });
    });

    afterEach(async () => {
      await virtual.stop();

      document.body.innerHTML = "";
    });

    it("should not add a visual cursor element to the container", async () => {
      expect(
        queryByTestId(document.body, "virtual-screen-reader-cursor")
      ).not.toBeInTheDocument();
    });

    it("should move through the next elements without a visual cursor", async () => {
      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.itemTextLog()).toEqual([
        "",
        "",
        "Nav Text",
        "",
        "Section Heading 1",
        "",
        "Section Text",
        "",
        "",
        "Article Header Heading 1",
        "",
        "Article Header Text",
        "",
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
    });
  });
});
