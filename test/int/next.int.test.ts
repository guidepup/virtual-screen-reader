import { getByRole } from "@testing-library/dom";
import { setupBasicPage } from "../utils.js";
import { virtual } from "../../src/index.js";

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

  it("should handle moving from the last element back to the first element", async () => {
    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    await virtual.clearItemTextLog();
    await virtual.clearSpokenPhraseLog();

    await virtual.next();

    expect(await virtual.itemTextLog()).toEqual([""]);
    expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
  });

  it("should handle the current node being removed from the DOM gracefully and set the active element back to the container", async () => {
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("Nav Text");

    const currentElement = getByRole(document.body, "navigation");
    document.body.removeChild(currentElement);

    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "Nav Text",
      "document",
    ]);
  });
});
