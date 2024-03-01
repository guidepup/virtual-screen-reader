import { getByRole } from "@testing-library/dom";
import { setupBasicPage } from "../utils.js";
import { virtual } from "../../src/index.js";

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
      "",
      "Article Text",
      "",
      "",
      "",
      "Article Header Text",
      "",
      "Article Header Heading 1",
      "",
      "",
      "",
      "Section Text",
      "",
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
      "end of paragraph",
      "Article Text",
      "paragraph",
      "end of banner",
      "end of paragraph",
      "Article Header Text",
      "paragraph",
      "heading, Article Header Heading 1, level 1",
      "banner",
      "article",
      "end of paragraph",
      "Section Text",
      "paragraph",
      "heading, Section Heading 1, level 1",
      "region",
      "end of navigation",
      "Nav Text",
      "navigation",
      "document",
    ]);
  });

  it("should handle moving from the first element back to the last element", async () => {
    await virtual.clearItemTextLog();
    await virtual.clearSpokenPhraseLog();

    await virtual.previous();

    expect(await virtual.itemTextLog()).toEqual([""]);
    expect(await virtual.spokenPhraseLog()).toEqual(["end of document"]);
  });

  it("should handle the current node being removed from the DOM gracefully and set the active element back to the container", async () => {
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("Nav Text");

    const currentElement = getByRole(document.body, "navigation");
    document.body.removeChild(currentElement);

    await virtual.previous();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "Nav Text",
      "document",
    ]);
  });
});
