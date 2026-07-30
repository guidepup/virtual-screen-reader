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

  it("should resolve aria-owns referencing an element inside shadow DOM", async () => {
    // Container with aria-owns pointing to an ID inside a shadow root
    const owner = document.createElement("div");
    owner.setAttribute("role", "listbox");
    owner.setAttribute("aria-label", "Owner");
    owner.setAttribute("aria-owns", "shadow-option");
    document.body.appendChild(owner);

    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const option = document.createElement("div");
    option.setAttribute("role", "option");
    option.setAttribute("id", "shadow-option");
    option.textContent = "Shadow Option";
    shadow.appendChild(option);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const log = await virtual.spokenPhraseLog();

    // The owned element inside shadow DOM should be found and reparented.
    // Listbox and option roles include extra ARIA attribute announcements.
    const hasListbox = log.some((p) => p.includes("listbox, Owner"));
    const hasOption = log.some(
      (p) => p.includes("option, Shadow Option") && p.includes("position 1")
    );
    expect(hasListbox).toBe(true);
    expect(hasOption).toBe(true);
  });

  it("should resolve aria-flowto referencing an element inside shadow DOM", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const target = document.createElement("div");
    target.setAttribute("id", "flow-target");
    target.setAttribute("role", "region");
    target.setAttribute("aria-label", "Target Region");
    target.textContent = "Flow target content";
    shadow.appendChild(target);

    // Source element with aria-flowto pointing into shadow DOM
    const source = document.createElement("button");
    source.setAttribute("aria-flowto", "flow-target");
    source.textContent = "Source";
    document.body.appendChild(source);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const log = await virtual.spokenPhraseLog();

    // Both the source and the shadow DOM target should be in the tree.
    // aria-flowto adds "alternate reading order" annotations to spoken output.
    const hasSource = log.some((p) => p.includes("button, Source"));
    const hasTarget = log.some((p) => p.includes("region, Target Region"));
    expect(hasSource).toBe(true);
    expect(hasTarget).toBe(true);
  });

  it("should resolve aria-owns referencing an element nested two shadow levels deep", async () => {
    const owner = document.createElement("div");
    owner.setAttribute("role", "listbox");
    owner.setAttribute("aria-label", "Deep Owner");
    owner.setAttribute("aria-owns", "deep-option");
    document.body.appendChild(owner);

    // Level 1: outer shadow host
    const outerHost = document.createElement("div");
    document.body.appendChild(outerHost);
    const outerShadow = outerHost.attachShadow({ mode: "open" });

    // Level 2: inner shadow host inside outer shadow
    const innerHost = document.createElement("div");
    outerShadow.appendChild(innerHost);
    const innerShadow = innerHost.attachShadow({ mode: "open" });

    // The target element is inside the innermost shadow root
    const option = document.createElement("div");
    option.setAttribute("role", "option");
    option.setAttribute("id", "deep-option");
    option.textContent = "Deep Option";
    innerShadow.appendChild(option);

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    const log = await virtual.spokenPhraseLog();

    const hasListbox = log.some((p) => p.includes("listbox, Deep Owner"));
    const hasOption = log.some(
      (p) => p.includes("option, Deep Option") && p.includes("position 1")
    );
    expect(hasListbox).toBe(true);
    expect(hasOption).toBe(true);
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
