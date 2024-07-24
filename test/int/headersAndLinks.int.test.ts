import { virtual } from "../../src/index.js";

describe("headers and links", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <h1><a href="/path">Heading Level 1 Containing Link</a></h1>
    <a href="/path"><h2>Link Containing Heading Level 2</h2></a>
    `;

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should not ignore non-trivial nested children elements", async () => {
    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, Heading Level 1 Containing Link, level 1",
      "link, Heading Level 1 Containing Link",
      "end of heading, Heading Level 1 Containing Link, level 1",
      "link, Link Containing Heading Level 2",
      "heading, Link Containing Heading Level 2, level 2",
      "end of link, Link Containing Heading Level 2",
      "end of document",
    ]);
  });
});
