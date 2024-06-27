import { virtual } from "../../../lib/cjs/index.js";
// In your code, replace with:
// import { virtual } from "@guidepup/virtual-screen-reader";

function setupBasicPage() {
  document.body.innerHTML = `
  <nav>Nav Text</nav>
  <section>
    <h1>First Section Heading</h1>
    <p>First Section Text</p>
    <article>
      <header>
        <h1>Article Header Heading</h1>
        <p>Article Header Text</p>
      </header>
      <p>Article Text</p>
    </article> 
  </section>
  <section>
    <h1>Second Section Heading</h1>
    <p>Second Section Text</p>
  </section>
  <section aria-hidden="true">
    <h1>Hidden Section Heading</h1>
    <p>Hidden Section Text</p>
  </section>
  <footer>Footer</footer>
  `;
}

describe("matchers", () => {
  beforeEach(() => {
    setupBasicPage();
  });

  afterEach(() => {
    document.body.innerHTML = ``;
  });

  describe("virtual screen reader tests", () => {
    test("navigating headings", async () => {
      await virtual.start({ container: document.body });

      await virtual.perform(virtual.commands.moveToNextHeading);
      const firstHeadingPhrase = await virtual.lastSpokenPhrase();

      do {
        await virtual.perform(virtual.commands.moveToNextHeading);
      } while ((await virtual.lastSpokenPhrase()) !== firstHeadingPhrase);

      expect(await virtual.spokenPhraseLog()).toMatchSnapshot();

      await virtual.stop();
    });
  });
});
