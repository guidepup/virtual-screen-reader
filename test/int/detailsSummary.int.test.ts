import { virtual } from "../../src/index.js";

describe("Details and Summary", () => {
  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should not announce the content of a closed details element", async () => {
    document.body.innerHTML = `
    <main>
      <details>
        <summary>Plan details</summary>
        <p>Hidden part</p>
        Hidden text
      </details>
    </main>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "main",
      "group",
      "Plan details",
      "end of group",
      "end of main",
      "end of document",
    ]);
  });

  it("should only announce the first summary of a closed details element", async () => {
    document.body.innerHTML = `
    <main>
      <details>
        <summary>First summary</summary>
        <summary>Second summary</summary>
      </details>
    </main>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "main",
      "group",
      "First summary",
      "end of group",
      "end of main",
      "end of document",
    ]);
  });

  it("should announce the content of an open details element", async () => {
    document.body.innerHTML = `
    <main>
      <details open>
        <summary>Plan details</summary>
        <p>Visible part</p>
      </details>
    </main>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "main",
      "group",
      "Plan details",
      "paragraph",
      "Visible part",
      "end of paragraph",
      "end of group",
      "end of main",
      "end of document",
    ]);
  });
});
