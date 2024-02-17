import { virtual } from '../../src/index.js';

describe("Allowed Accessibility Child Roles", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should handle a direct DOM child", async () => {
    document.body.innerHTML = `
    <div role="listbox">
      <div role="option">option text</div>
    </div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "listbox, orientated vertically",
      "option, option text, not selected",
      "end of listbox, orientated vertically",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle a DOM child with generics intervening", async () => {
    document.body.innerHTML = `
    <div role="listbox">
      <div>
        <div role="option">option text</div>
      </div>
    </div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "listbox, orientated vertically",
      "option, option text, not selected",
      "end of listbox, orientated vertically",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle a direct aria-owns relationship", async () => {
    document.body.innerHTML = `
    <div role="listbox" aria-owns="id1"></div>
    <div role="option" id="id1">option text</div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "listbox, orientated vertically",
      "option, option text, not selected",
      "end of listbox, orientated vertically",
      "end of document",
    ]);

    await virtual.stop();
  });

  it("should handle an aria-owns relationship with generics intervening", async () => {
    document.body.innerHTML = `
    <div role="listbox" aria-owns="id1"></div>
    <div id="id1">
      <div>
        <div role="option">option text</div>
      </div>
    </div>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "listbox, orientated vertically",
      "option, option text, not selected",
      "end of listbox, orientated vertically",
      "end of document",
    ]);

    await virtual.stop();
  });
});
