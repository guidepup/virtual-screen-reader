import { virtual } from '../../src/index.js';

describe("Edge Case Container", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should handle edge case containers such as comment nodes gracefully", async () => {
    document.body.innerHTML = `
    <!-- HTML Comment -->
    <div>Some Text</div>
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await virtual.start({ container: document.body.childNodes[0] as any });
    await virtual.next();
    await virtual.next();

    expect(await virtual.itemText()).toEqual("");
    expect(await virtual.lastSpokenPhrase()).toEqual("");
    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });
});
