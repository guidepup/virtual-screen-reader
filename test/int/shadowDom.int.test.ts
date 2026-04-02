import { virtual } from "../../src/index.js";

describe("Shadow DOM", () => {
  afterEach(async () => {
    await virtual.stop();

    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should traverse into an open shadow root", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Shadow Nav");
    const button = document.createElement("button");
    button.textContent = "Click me";
    nav.appendChild(button);
    shadow.appendChild(nav);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation, Shadow Nav",
      "button, Click me",
      "end of navigation, Shadow Nav",
      "end of document",
    ]);
  });

  it("should traverse nested shadow roots", async () => {
    const outerHost = document.createElement("div");
    document.body.appendChild(outerHost);

    const outerShadow = outerHost.attachShadow({ mode: "open" });
    const innerHost = document.createElement("div");
    outerShadow.appendChild(innerHost);

    const innerShadow = innerHost.attachShadow({ mode: "open" });
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Deep Nav");
    const button = document.createElement("button");
    button.textContent = "Deep button";
    nav.appendChild(button);
    innerShadow.appendChild(nav);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation, Deep Nav",
      "button, Deep button",
      "end of navigation, Deep Nav",
      "end of document",
    ]);
  });

  it("should resolve slotted content", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Slotted Nav");
    const slot = document.createElement("slot");
    nav.appendChild(slot);
    shadow.appendChild(nav);

    // Light DOM child — projected into the slot
    const button = document.createElement("button");
    button.textContent = "Slotted button";
    host.appendChild(button);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation, Slotted Nav",
      "button, Slotted button",
      "end of navigation, Slotted Nav",
      "end of document",
    ]);
  });

  it("should use slot default content when no nodes are assigned", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    const fallback = document.createElement("span");
    fallback.textContent = "Default content";
    slot.appendChild(fallback);
    shadow.appendChild(slot);

    // No light DOM children — slot default content should be used

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Default content",
      "end of document",
    ]);
  });

  it("should handle shadow DOM host with aria attributes", async () => {
    const host = document.createElement("div");
    host.setAttribute("role", "navigation");
    host.setAttribute("aria-label", "Host Nav");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const list = document.createElement("ul");
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "Nav item";
    item.appendChild(link);
    list.appendChild(item);
    shadow.appendChild(list);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const log = await virtual.spokenPhraseLog();

    // Verify the host's role and aria-label are announced
    expect(log).toContain("navigation, Host Nav");
    // Verify the shadow DOM content (list, listitem, link) is traversed
    expect(log).toContain("list");
    expect(log).toContain("listitem, level 1, position 1, set size 1");
    expect(log).toContain("link, Nav item");
    expect(log).toContain("end of navigation, Host Nav");
    expect(log).toContain("end of document");
  });

  it("should not traverse closed shadow roots", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    // Closed shadow root — host.shadowRoot is null
    host.attachShadow({ mode: "closed" }).appendChild(
      Object.assign(document.createElement("button"), {
        textContent: "Hidden button",
      })
    );

    // Add visible content outside
    const visible = document.createElement("span");
    visible.textContent = "Visible text";
    document.body.appendChild(visible);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const log = await virtual.spokenPhraseLog();

    // The closed shadow content should NOT appear
    expect(log).not.toContain("button, Hidden button");
    expect(log).toContain("Visible text");
  });
});
