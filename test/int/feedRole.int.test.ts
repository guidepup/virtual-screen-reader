import { virtual } from "../../src/index.js";

describe("feed role focus behavior", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should set focus on the article when moving cursor into an article in a feed", async () => {
    document.body.innerHTML = `
      <header>Header content</header>
      <div role="feed" id="feed">
        <article id="art1" tabindex="-1">
          <h2>Article 1 Title</h2>
          <p>Article 1 Text</p>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;

    await virtual.start({ container: document.body });

    expect(await virtual.lastSpokenPhrase()).toBe("document");

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("banner");
    expect(document.activeElement).not.toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("Header content");

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of banner");

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("feed");

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(art1);
  });

  it("should transition focus to the new article when moving between articles in a feed", async () => {
    document.body.innerHTML = `
      <div role="feed" id="feed">
        <article id="art1" tabindex="-1">
          <h2>Article 1</h2>
          <p>Text 1</p>
        </article>
        <article id="art2" tabindex="-1">
          <h2>Article 2</h2>
          <p>Text 2</p>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const art2 = document.getElementById("art2")!;

    await virtual.start({ container: document.body });

    expect(await virtual.lastSpokenPhrase()).toBe("document");

    // Move to feed
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("feed");

    // Move to Article 1
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(art1);

    // Read through Article 1
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("heading, Article 1, level 2");
    expect(document.activeElement).toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("paragraph");
    expect(document.activeElement).toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("Text 1");
    expect(document.activeElement).toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of paragraph");
    expect(document.activeElement).toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of article");
    expect(document.activeElement).toBe(art1);

    // Transition from Article 1 to Article 2
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(art2);
  });

  it("should focus a focusable element when landing directly on it inside an article", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="art1" tabindex="-1">
          <h2>Article 1</h2>
          <button id="btn1">Like</button>
          <button id="btn2">Share</button>
          <p>Comments</p>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const btn1 = document.getElementById("btn1")!;
    const btn2 = document.getElementById("btn2")!;

    await virtual.start({ container: document.body });

    expect(await virtual.lastSpokenPhrase()).toBe("document");

    // feed
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("feed");

    // article (art1)
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(art1);

    // heading
    await virtual.next();
    expect(document.activeElement).toBe(art1);

    // Move to btn1
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Like");
    expect(document.activeElement).toBe(btn1);

    // Move to btn2
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Share");
    expect(document.activeElement).toBe(btn2);

    // Move to paragraph
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("paragraph");
    expect(document.activeElement).toBe(btn2);
  });

  it("should focus the focusable element in lieu of the containing article when transitioning directly onto it", async () => {
    document.body.innerHTML = `
      <nav>Navigation</nav>
      <div role="feed">
        <article id="art1" tabindex="-1">
          <a href="#action" id="leadLink">Action</a>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const leadLink = document.getElementById("leadLink")!;
    const artFocusSpy = jest.spyOn(art1, "focus");

    await virtual.start({ container: document.body });

    // Move to link in article using perform command
    await virtual.perform(virtual.commands.moveToNextLink);
    expect(await virtual.lastSpokenPhrase()).toBe("link, Action");
    expect(document.activeElement).toBe(leadLink);
    expect(artFocusSpy).not.toHaveBeenCalled();
  });

  it("should not repeatedly re-trigger focus when moving within the same article unless changing to a focusable element", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="art1" tabindex="-1">
          <h2>Article Title</h2>
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <button id="btn1">Like</button>
          <p>Third paragraph</p>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const btn1 = document.getElementById("btn1")!;
    const artFocusSpy = jest.spyOn(art1, "focus");
    const btnFocusSpy = jest.spyOn(btn1, "focus");

    await virtual.start({ container: document.body });

    // document
    expect(await virtual.lastSpokenPhrase()).toBe("document");

    // feed
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("feed");

    // art1 (article) -> sets focus once
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(art1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to heading
    await virtual.next();
    expect(document.activeElement).toBe(art1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to paragraph 1
    await virtual.next();
    await virtual.next();
    await virtual.next();
    expect(document.activeElement).toBe(art1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to paragraph 2
    await virtual.next();
    await virtual.next();
    await virtual.next();
    expect(document.activeElement).toBe(art1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to button (focusable element)
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Like");
    expect(document.activeElement).toBe(btn1);
    expect(btnFocusSpy).toHaveBeenCalledTimes(1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to paragraph 3 (non-focusable, same article)
    await virtual.next();
    expect(document.activeElement).toBe(btn1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);

    // Move to end of article
    await virtual.next();
    await virtual.next();
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of article");
    expect(document.activeElement).toBe(btn1);
    expect(artFocusSpy).toHaveBeenCalledTimes(1);
  });

  it("should not trigger feed-specific focus shifts for non-feed articles", async () => {
    document.body.innerHTML = `
      <main>
        <article id="standalone" tabindex="-1">
          <h2>Standalone Article</h2>
          <p>Standalone text</p>
          <button id="standaloneBtn">Standalone button</button>
        </article>
      </main>
    `;

    const standalone = document.getElementById("standalone")!;
    const standaloneBtn = document.getElementById("standaloneBtn")!;
    const artFocusSpy = jest.spyOn(standalone, "focus");
    const btnFocusSpy = jest.spyOn(standaloneBtn, "focus");

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(artFocusSpy).not.toHaveBeenCalled();
    expect(btnFocusSpy).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  });

  it("should transition focus backward when navigating with previous()", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="art1" tabindex="-1">
          <p>Text 1</p>
        </article>
        <article id="art2" tabindex="-1">
          <p>Text 2</p>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const art2 = document.getElementById("art2")!;

    await virtual.start({ container: document.body });

    // Navigate into Article 2
    while ((await virtual.lastSpokenPhrase()) !== "Text 2") {
      await virtual.next();
    }
    expect(document.activeElement).toBe(art2);

    // Navigate backward into Article 1
    while ((await virtual.lastSpokenPhrase()) !== "Text 1") {
      await virtual.previous();
    }
    expect(document.activeElement).toBe(art1);
  });

  it("should handle custom role='article' elements in a feed", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <div role="article" id="customArt" tabindex="-1">
          <p>Custom article content</p>
        </div>
      </div>
    `;

    const customArt = document.getElementById("customArt")!;

    await virtual.start({ container: document.body });

    // document -> feed -> article
    await virtual.next();
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(customArt);
  });

  it("should handle nested articles within a feed", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="outerArt" tabindex="-1">
          <h2>Outer Article</h2>
          <article id="innerArt" tabindex="-1">
            <h3>Inner Article</h3>
          </article>
        </article>
      </div>
    `;

    const outerArt = document.getElementById("outerArt")!;
    const innerArt = document.getElementById("innerArt")!;

    await virtual.start({ container: document.body });

    // document -> feed -> outer article
    await virtual.next();
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(outerArt);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("heading, Outer Article, level 2");
    expect(document.activeElement).toBe(outerArt);

    // Move into inner article
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(innerArt);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("heading, Inner Article, level 3");
    expect(document.activeElement).toBe(innerArt);

    // Move to end of inner article
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of article");
    expect(document.activeElement).toBe(innerArt);

    // Move to end of outer article
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("end of article");
    expect(document.activeElement).toBe(outerArt);
  });

  it("should handle moving cursor out of a feed cleanly without disturbing focus", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="art1" tabindex="-1">
          <p>Text</p>
        </article>
      </div>
      <footer>Footer content</footer>
    `;

    const art1 = document.getElementById("art1")!;

    await virtual.start({ container: document.body });

    // document -> feed -> article
    await virtual.next();
    await virtual.next();
    expect(document.activeElement).toBe(art1);

    // Navigate to footer
    while ((await virtual.lastSpokenPhrase()) !== "Footer content") {
      await virtual.next();
    }

    expect(await virtual.lastSpokenPhrase()).toBe("Footer content");
    // Focus remains on last focused element without crashing
    expect(document.activeElement).toBe(art1);
  });

  it("should handle an article without tabindex gracefully", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="noTabindex">
          <p>Content without tabindex</p>
        </article>
      </div>
    `;

    await virtual.start({ container: document.body });

    // document -> feed -> article
    await virtual.next();
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    // Calling next did not throw, activeElement remains body
    expect(document.activeElement).toBe(document.body);
  });

  it("should handle aria-owns feed relationships", async () => {
    document.body.innerHTML = `
      <div role="feed" aria-owns="ownedArt"></div>
      <article id="ownedArt" tabindex="-1">
        <p>Owned content</p>
      </article>
    `;

    const ownedArt = document.getElementById("ownedArt")!;

    await virtual.start({ container: document.body });

    // document -> feed -> article
    await virtual.next();
    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("article");
    expect(document.activeElement).toBe(ownedArt);
  });

  it("should not focus disabled elements inside an article", async () => {
    document.body.innerHTML = `
      <div role="feed">
        <article id="art1" tabindex="-1">
          <button disabled id="disabledBtn">Cannot Click</button>
        </article>
      </div>
    `;

    const art1 = document.getElementById("art1")!;
    const disabledBtn = document.getElementById("disabledBtn")!;

    await virtual.start({ container: document.body });

    // document -> feed -> article
    await virtual.next();
    await virtual.next();
    expect(document.activeElement).toBe(art1);

    await virtual.next();
    expect(await virtual.lastSpokenPhrase()).toBe("button, Cannot Click, disabled");
    expect(document.activeElement).toBe(art1);
    expect(document.activeElement).not.toBe(disabledBtn);
  });
});
