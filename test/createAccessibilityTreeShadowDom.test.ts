import { createAccessibilityTree } from "../src/createAccessibilityTree.js";
import { getElementFromNode } from "../src/getElementFromNode.js";
import { getNodeByIdRef } from "../src/getNodeByIdRef.js";

describe("createAccessibilityTree with Shadow DOM", () => {
  let customElementCounter = 0;

  function defineElement(template: string) {
    const tagName = `test-elem-${++customElementCounter}`;

    class TestElement extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = template;
      }
    }

    customElements.define(tagName, TestElement);
    return tagName;
  }

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("open shadow root traversal", () => {
    it("should traverse children of an open shadowRoot", () => {
      const tag = defineElement(`
        <h1>Shadow Title</h1>
        <p>Shadow Description</p>
      `);

      const container = document.createElement("div");
      container.innerHTML = `<${tag}></${tag}>`;
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);

      expect(tree).not.toBeNull();
      const hostNode = tree!.children[0];
      expect(hostNode).toBeDefined();

      const shadowHeading = hostNode.children.find(
        (c) => c.role === "heading"
      );
      expect(shadowHeading).toBeDefined();
      expect(shadowHeading!.accessibleName).toBe("Shadow Title");

      const shadowParagraph = hostNode.children.find(
        (c) => c.role === "paragraph"
      );
      expect(shadowParagraph).toBeDefined();
    });

    it("should unwrap slot elements and traverse assigned nodes", () => {
      const tag = defineElement(`
        <header>Shadow Header</header>
        <slot></slot>
        <footer>Shadow Footer</footer>
      `);

      const container = document.createElement("div");
      container.innerHTML = `<${tag}><button>Slotted Button</button></${tag}>`;
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);

      expect(tree).not.toBeNull();
      const hostNode = tree!.children[0];

      // Children of host should be header, button (unwrapped through slot), and footer
      const childRoles = hostNode.children.map((c) => c.role);
      expect(childRoles).toEqual(["banner", "button", "contentinfo"]);

      const buttonNode = hostNode.children.find((c) => c.role === "button");
      expect(buttonNode!.accessibleName).toBe("Slotted Button");
    });

    it("should handle slot fallback content when no nodes are assigned", () => {
      const tag = defineElement(`
        <slot><p>Default Fallback</p></slot>
      `);

      const container = document.createElement("div");
      container.innerHTML = `<${tag}></${tag}>`;
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);

      expect(tree).not.toBeNull();
      const hostNode = tree!.children[0];

      const paragraphNode = hostNode.children.find(
        (c) => c.role === "paragraph"
      );
      expect(paragraphNode).toBeDefined();
    });

    it("should exclude unslotted light DOM children from the tree", () => {
      const tag = defineElement(`
        <header>Shadow Only</header>
      `);

      const container = document.createElement("div");
      // This light DOM button is not assigned to any slot because shadow DOM has no slot
      container.innerHTML = `<${tag}><button>Hidden Button</button></${tag}>`;
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);

      expect(tree).not.toBeNull();
      const hostNode = tree!.children[0];

      const buttonNode = hostNode.children.find((c) => c.role === "button");
      expect(buttonNode).toBeUndefined();
    });

    it("should handle slot element in light DOM with children", () => {
      const container = document.createElement("div");
      container.innerHTML = "<slot><p>Light Slot Child</p></slot>";
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);
      expect(tree).not.toBeNull();
      const p = tree!.children.find((c) => c.role === "paragraph");
      expect(p).toBeDefined();
    });

    it("should handle container element matching aria-owns", () => {
      const container = document.createElement("div");
      container.setAttribute("aria-owns", "owned-child");
      container.innerHTML = "<span id=\"owned-child\">Owned</span>";
      document.body.appendChild(container);

      const tree = createAccessibilityTree(container);
      expect(tree).not.toBeNull();
    });
  });

  describe("getNodeByIdRef with shadow DOM", () => {
    it("should find elements inside open shadow roots", () => {
      const tag = defineElement(`
        <button id="shadow-btn">Action</button>
      `);

      const host = document.createElement(tag);
      document.body.appendChild(host);

      const found = getNodeByIdRef({
        container: document.body,
        idRef: "shadow-btn",
      });

      expect(found).not.toBeNull();
      expect(found!.id).toBe("shadow-btn");
      expect(found!.textContent).toBe("Action");
    });

    it("should find elements inside nested shadow roots", () => {
      const innerTag = defineElement(`
        <input id="nested-input" type="text" value="Deep" />
      `);
      const outerTag = defineElement(`
        <${innerTag}></${innerTag}>
      `);

      const host = document.createElement(outerTag);
      document.body.appendChild(host);

      const found = getNodeByIdRef({
        container: document.body,
        idRef: "nested-input",
      });

      expect(found).not.toBeNull();
      expect(found!.id).toBe("nested-input");
    });

    it("should return container itself if its id matches idRef", () => {
      const container = document.createElement("div");
      container.id = "my-container-id";
      document.body.appendChild(container);

      const found = getNodeByIdRef({
        container,
        idRef: "my-container-id",
      });
      expect(found).toBe(container);
    });

    it("should find element in container shadowRoot when container is the custom element", () => {
      const tag = defineElement(`
        <button id="direct-shadow-btn">Direct</button>
      `);
      const host = document.createElement(tag);
      document.body.appendChild(host);

      const found = getNodeByIdRef({
        container: host,
        idRef: "direct-shadow-btn",
      });
      expect(found).not.toBeNull();
      expect(found!.id).toBe("direct-shadow-btn");
    });

    it("should return null for non-container node or empty idRef", () => {
      const textNode = document.createTextNode("text");
      expect(getNodeByIdRef({ container: textNode, idRef: "foo" })).toBeNull();
      expect(
        getNodeByIdRef({ container: document.body, idRef: "" })
      ).toBeNull();
    });

    it("should return null when element id does not exist", () => {
      const tag = defineElement(`
        <div id="existing-id">Content</div>
      `);

      const host = document.createElement(tag);
      document.body.appendChild(host);

      const found = getNodeByIdRef({
        container: document.body,
        idRef: "nonexistent-id",
      });

      expect(found).toBeNull();
    });
  });

  describe("getElementFromNode", () => {
    it("should return element itself when node is an element", () => {
      const el = document.createElement("div");
      expect(getElementFromNode(el)).toBe(el);
    });

    it("should return parentElement when node is a regular child text node", () => {
      const el = document.createElement("div");
      el.textContent = "Text";
      const textNode = el.childNodes[0];
      expect(getElementFromNode(textNode)).toBe(el);
    });

    it("should return host element when node is a text node directly inside shadowRoot", () => {
      const tag = defineElement("Direct text in shadow");
      const host = document.createElement(tag);
      document.body.appendChild(host);

      const textNode = host.shadowRoot!.childNodes[0];
      expect(getElementFromNode(textNode)).toBe(host);
    });
  });
});
