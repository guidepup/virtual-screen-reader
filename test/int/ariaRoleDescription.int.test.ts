import { virtual } from '../../src/index.js';

describe("Aria Role Description", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce the aria-roledescription in place of the role", async () => {
    document.body.innerHTML = `
    <div role="article" aria-roledescription="slide" id="slide" aria-labelledby="slideheading">
      <h1 id="slideheading">Quarterly Report</h1>
      <!-- remaining slide contents -->
    </div>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("slide, Quarterly Report");

    await virtual.stop();
  });

  it("should announce the aria-roledescription in place of the role", async () => {
    document.body.innerHTML = `
    <article aria-roledescription="slide" id="slide" aria-labelledby="slideheading">
      <h1 id="slideheading">Quarterly Report</h1>
      <!-- remaining slide contents -->
    </article>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("slide, Quarterly Report");

    await virtual.stop();
  });
});
