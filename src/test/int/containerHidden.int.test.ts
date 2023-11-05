import { virtual } from "../..";

describe("Container Hidden", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div id="container" style="display: none;">This content is not announced</div>
    `;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await virtual.start({ container: document.querySelector("#container")! });
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should not announce anything if the container is itself hidden from screen readers", async () => {
    expect(await virtual.itemTextLog()).toEqual([]);
    expect(await virtual.spokenPhraseLog()).toEqual([]);
  });

  it("should handle requests to move next and previous gracefully if the container is itself hidden from screen readers", async () => {
    await virtual.next();
    await virtual.next();
    await virtual.previous();
    await virtual.previous();

    expect(await virtual.itemTextLog()).toEqual([]);
    expect(await virtual.spokenPhraseLog()).toEqual([]);
  });
});
