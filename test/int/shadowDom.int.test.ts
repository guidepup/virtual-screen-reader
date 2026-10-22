import { virtual } from "../../src/index.js";

describe("Shadow DOM Integration", () => {
  let customElementCounter = 0;

  function defineElement(template: string) {
    const tagName = `shadow-elem-${++customElementCounter}`;

    class ShadowElement extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = template;
      }
    }

    customElements.define(tagName, ShadowElement);
    return tagName;
  }

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should speak all accessible content inside an open shadow root", async () => {
    const tag = defineElement(`
      <nav>Shadow Navigation</nav>
      <h1>Shadow Heading</h1>
      <p>Shadow Paragraph</p>
      <button>Shadow Button</button>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "navigation",
      "Shadow Navigation",
      "end of navigation",
      "heading, Shadow Heading, level 1",
      "paragraph",
      "Shadow Paragraph",
      "end of paragraph",
      "button, Shadow Button",
      "end of document",
    ]);
  });

  it("should correctly interleave shadow DOM elements and slotted content in spoken phrase log", async () => {
    const tag = defineElement(`
      <header>
        <h1>Component Header</h1>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <button>Action</button>
      </footer>
    `);

    document.body.innerHTML = `
      <${tag}>
        <p>Slotted Light DOM Content</p>
      </${tag}>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "banner",
      "heading, Component Header, level 1",
      "end of banner",
      "main",
      "paragraph",
      "Slotted Light DOM Content",
      "end of paragraph",
      "end of main",
      "contentinfo",
      "button, Action",
      "end of contentinfo",
      "end of document",
    ]);
  });

  it("should resolve named slots in the order defined by shadow DOM structure", async () => {
    const tag = defineElement(`
      <section aria-label="Card">
        <h2><slot name="title"></slot></h2>
        <div><slot name="body"></slot></div>
        <div><slot name="action"></slot></div>
      </section>
    `);

    document.body.innerHTML = `
      <${tag}>
        <button slot="action">Submit</button>
        <span slot="title">Card Title</span>
        <p slot="body">Card Description</p>
      </${tag}>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "region, Card",
      "heading, Card Title, level 2",
      "Card Title",
      "end of heading, Card Title, level 2",
      "paragraph",
      "Card Description",
      "end of paragraph",
      "button, Submit",
      "end of region, Card",
      "end of document",
    ]);
  });

  it("should speak fallback content when nothing is assigned to a slot", async () => {
    const tag = defineElement(`
      <slot>
        <p>Fallback Content</p>
      </slot>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "paragraph",
      "Fallback Content",
      "end of paragraph",
      "end of document",
    ]);
  });

  it("should ignore unslotted light DOM elements", async () => {
    const tag = defineElement(`
      <p>Only Shadow Visible</p>
    `);

    document.body.innerHTML = `
      <${tag}>
        <button>Hidden Button</button>
        <p>Hidden Paragraph</p>
      </${tag}>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "paragraph",
      "Only Shadow Visible",
      "end of paragraph",
      "end of document",
    ]);
  });

  it("should navigate shadow DOM headings using moveToNextHeading", async () => {
    const tag = defineElement(`
      <h1>Heading in Shadow</h1>
      <h2>Subheading in Shadow</h2>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    await virtual.perform(virtual.commands.moveToNextHeading);
    expect(await virtual.lastSpokenPhrase()).toBe(
      "heading, Heading in Shadow, level 1"
    );

    await virtual.perform(virtual.commands.moveToNextHeading);
    expect(await virtual.lastSpokenPhrase()).toBe(
      "heading, Subheading in Shadow, level 2"
    );
  });

  it("should navigate shadow DOM landmarks using moveToNextLandmark", async () => {
    const tag = defineElement(`
      <header>Shadow Banner</header>
      <main>Shadow Main</main>
      <footer>Shadow Footer</footer>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    await virtual.perform(virtual.commands.moveToNextLandmark);
    expect(await virtual.lastSpokenPhrase()).toBe("banner");

    await virtual.perform(virtual.commands.moveToNextLandmark);
    expect(await virtual.lastSpokenPhrase()).toBe("main");

    await virtual.perform(virtual.commands.moveToNextLandmark);
    expect(await virtual.lastSpokenPhrase()).toBe("contentinfo");
  });

  it("should navigate shadow DOM links using moveToNextLink", async () => {
    const tag = defineElement(`
      <a href="https://example.com">Shadow Link</a>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    await virtual.perform(virtual.commands.moveToNextLink);
    expect(await virtual.lastSpokenPhrase()).toBe("link, Shadow Link");
  });

  it("should navigate shadow DOM landmarks using specific landmark commands", async () => {
    const tag = defineElement(`
      <header>Shadow Header</header>
      <main>Shadow Content</main>
      <footer>Shadow Footer</footer>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    await virtual.perform(virtual.commands.moveToNextBanner);
    expect(await virtual.lastSpokenPhrase()).toBe("banner");

    await virtual.perform(virtual.commands.moveToNextMain);
    expect(await virtual.lastSpokenPhrase()).toBe("main");

    await virtual.perform(virtual.commands.moveToNextContentinfo);
    expect(await virtual.lastSpokenPhrase()).toBe("contentinfo");
  });

  it("should allow clicking a button inside shadow DOM and trigger its handler", async () => {
    let clicked = false;
    const tagName = `clickable-elem-${++customElementCounter}`;

    class ClickableElement extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const button = document.createElement("button");
        button.textContent = "Click Me";
        button.addEventListener("click", () => {
          clicked = true;
        });
        shadow.appendChild(button);
      }
    }

    customElements.define(tagName, ClickableElement);

    document.body.innerHTML = `<${tagName}></${tagName}>`;

    await virtual.start({ container: document.body });

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Click Me");

    await virtual.click();
    expect(clicked).toBe(true);
  });

  it("should update activeNode on focusin event for an element inside shadow DOM", async () => {
    const tag = defineElement(`
      <button id="focus-btn">Focus Target</button>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    const host = document.querySelector(tag)!;
    const btn = host.shadowRoot!.querySelector("button")!;
    btn.focus();

    // Allow event and tick to flush
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(virtual.activeNode).toBe(btn);
  });

  it("should work when starting virtual directly on the custom element as container", async () => {
    const tag = defineElement(`
      <nav>Component Nav</nav>
      <p>Component Paragraph</p>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;
    const host = document.querySelector(tag)!;

    await virtual.start({ container: host });

    while ((await virtual.lastSpokenPhrase()) !== "end of navigation") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toContain("navigation");
    expect(spokenPhraseLog).toContain("Component Nav");
    expect(spokenPhraseLog).toContain("end of navigation");
  });

  it("should handle nested web components with shadow DOM", async () => {
    const childTag = defineElement(`
      <button>Inner Button</button>
    `);
    const parentTag = defineElement(`
      <h1>Outer Heading</h1>
      <${childTag}></${childTag}>
    `);

    document.body.innerHTML = `<${parentTag}></${parentTag}>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(spokenPhraseLog).toEqual([
      "document",
      "heading, Outer Heading, level 1",
      "button, Inner Button",
      "end of document",
    ]);
  });

  it("should support aria-flowto targeting an element inside shadow DOM", async () => {
    const tag = defineElement(`
      <p id="target-para">Shadow Flow Target</p>
    `);

    document.body.innerHTML = `
      <button aria-flowto="target-para">Start Button</button>
      <${tag}></${tag}>
    `;

    await virtual.start({ container: document.body });

    // Move to start button
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toContain("Start Button");

    // Move along alternate reading order
    await virtual.perform(
      virtual.commands.moveToNextAlternateReadingOrderElement
    );
    expect(await virtual.lastSpokenPhrase()).toBe(
      "paragraph, 1 previous alternate reading order"
    );
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("Shadow Flow Target");
  });

  it("should support aria-owns with an element inside shadow DOM", async () => {
    const tag = defineElement(`
      <div id="owned-child" role="button">Shadow Owned Button</div>
    `);

    document.body.innerHTML = `
      <div role="region" aria-label="Owning Region" aria-owns="owned-child"></div>
      <${tag}></${tag}>
    `;

    await virtual.start({ container: document.body });

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("region, Owning Region");

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Shadow Owned Button");
  });

  it("should react to dynamic mutations inside shadow DOM", async () => {
    const tag = defineElement(`
      <p id="dynamic-text">Initial Text</p>
    `);

    document.body.innerHTML = `<${tag}></${tag}>`;

    await virtual.start({ container: document.body });

    await virtual.next(); // paragraph
    await virtual.next(); // Initial Text
    expect(await virtual.lastSpokenPhrase()).toBe("Initial Text");

    // Dynamically mutate inside shadow root
    const host = document.querySelector(tag)!;
    const para = host.shadowRoot!.querySelector("#dynamic-text")!;
    para.textContent = "Updated Text";

    // Wait for mutation observer
    await new Promise((resolve) => setTimeout(resolve, 50));

    // When the active text node is replaced in the DOM, virtual gracefully resets to container ("document")
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("document");
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("paragraph");
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("Updated Text");
  });

  it("should handle live region mutations inside shadow DOM", async () => {
    const tag = defineElement(`
      <p id="live-text">Initial Live</p>
    `);

    document.body.innerHTML = `<${tag} aria-live="polite"></${tag}>`;

    await virtual.start({ container: document.body });

    const host = document.querySelector(tag)!;
    const p = host.shadowRoot!.querySelector("#live-text")!;
    p.textContent = "Polite Update";

    await new Promise((resolve) => setTimeout(resolve, 50));

    const spokenPhraseLog = await virtual.spokenPhraseLog();
    expect(
      spokenPhraseLog.some((phrase) => phrase.includes("polite: Polite Update"))
    ).toBe(true);
  });
});
