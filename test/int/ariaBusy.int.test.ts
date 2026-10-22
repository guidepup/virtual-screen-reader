import { createAccessibilityTree } from "../../src/createAccessibilityTree.js";
import { flattenTree } from "../../src/flattenTree.js";
import { virtual } from "../../src/index.js";
import { waitFor } from "@testing-library/dom";

describe("Aria Busy State", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("navigation announcement", () => {
    it("should announce that a button with an aria-busy attribute set to true is 'busy'", async () => {
      document.body.innerHTML = `
      <button aria-busy="true">Submit</button>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();

      expect(await virtual.lastSpokenPhrase()).toBe("button, Submit, busy");

      await virtual.stop();
    });

    it("should announce that a button with an aria-busy attribute set to false is 'not busy'", async () => {
      document.body.innerHTML = `
      <button aria-busy="false">Submit</button>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();

      expect(await virtual.lastSpokenPhrase()).toBe("button, Submit, not busy");

      await virtual.stop();
    });

    it("should announce a button without an aria-busy attribute without any busy state labelling", async () => {
      document.body.innerHTML = `
      <button>Submit</button>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();

      expect(await virtual.lastSpokenPhrase()).toBe("button, Submit");

      await virtual.stop();
    });

    it("should announce busy state on a container element", async () => {
      document.body.innerHTML = `
      <div role="region" aria-label="Notifications" aria-busy="true">
        <p>You have new messages</p>
      </div>
      `;

      await virtual.start({ container: document.body });

      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "region, Notifications, busy",
        "paragraph",
        "You have new messages",
        "end of paragraph",
        "end of region, Notifications, busy",
        "end of document",
      ]);

      await virtual.stop();
    });

    it("should announce busy state on a generic element", async () => {
      document.body.innerHTML = `
      <div aria-busy="true">Loading content</div>
      `;

      await virtual.start({ container: document.body });

      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "busy",
        "Loading content",
        "end, busy",
        "end of document",
      ]);

      await virtual.stop();
    });
  });

  describe("accessibility tree exposure", () => {
    it("should expose busy state as true in accessibility tree when aria-busy is true", () => {
      document.body.innerHTML = `
      <button id="btn" aria-busy="true">Save</button>
      `;

      const tree = createAccessibilityTree(document.body)!;
      const flattened = flattenTree(document.body, tree, null);
      const treeNode = tree.children.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );
      const buttonNode = flattened.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );

      expect(treeNode?.busy).toBe(true);
      expect(buttonNode?.busy).toBe(true);
      expect(buttonNode?.accessibleAttributeToLabelMap["aria-busy"]).toEqual({
        label: "busy",
        value: "true",
      });
      expect(buttonNode?.accessibleAttributeLabels).toContain("busy");
    });

    it("should expose busy state as false in accessibility tree when aria-busy is false", () => {
      document.body.innerHTML = `
      <button id="btn" aria-busy="false">Save</button>
      `;

      const tree = createAccessibilityTree(document.body)!;
      const flattened = flattenTree(document.body, tree, null);
      const treeNode = tree.children.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );
      const buttonNode = flattened.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );

      expect(treeNode?.busy).toBe(false);
      expect(buttonNode?.busy).toBe(false);
      expect(buttonNode?.accessibleAttributeToLabelMap["aria-busy"]).toEqual({
        label: "not busy",
        value: "false",
      });
      expect(buttonNode?.accessibleAttributeLabels).toContain("not busy");
    });

    it("should expose busy state as false in accessibility tree when aria-busy is absent", () => {
      document.body.innerHTML = `
      <button id="btn">Save</button>
      `;

      const tree = createAccessibilityTree(document.body)!;
      const flattened = flattenTree(document.body, tree, null);
      const treeNode = tree.children.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );
      const buttonNode = flattened.find(
        ({ node }) => (node as HTMLElement).id === "btn"
      );

      expect(treeNode?.busy).toBe(false);
      expect(buttonNode?.busy).toBe(false);
      expect(buttonNode?.accessibleAttributeToLabelMap["aria-busy"]).toBeUndefined();
      expect(buttonNode?.accessibleAttributeLabels).not.toContain("busy");
    });
  });

  describe("live regions with aria-busy", () => {
    it("should suppress intermediate updates when aria-busy is set to true on a polite live region and announce atomic update when busy ends", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite">Initial content</div>
      `;

      await virtual.start({ container: document.body });

      const live = document.getElementById("live")!;
      live.setAttribute("aria-busy", "true");

      // Update content while busy - should be suppressed
      live.textContent = "Intermediate update 1";
      live.textContent = "Intermediate update 2";

      // Give observer time to fire
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);

      // Complete updates by clearing aria-busy
      live.setAttribute("aria-busy", "false");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toBe(
          "polite: Intermediate update 2"
        );
      });

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "polite: Intermediate update 2",
      ]);

      await virtual.stop();
    });

    it("should suppress intermediate updates when aria-busy is set to true on an assertive live region and announce atomic update when busy ends", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="assertive">Initial alert</div>
      `;

      await virtual.start({ container: document.body });

      const live = document.getElementById("live")!;
      live.setAttribute("aria-busy", "true");
      live.textContent = "Severe error occurred";

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);

      live.setAttribute("aria-busy", "false");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toBe(
          "assertive: Severe error occurred"
        );
      });

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "assertive: Severe error occurred",
      ]);

      await virtual.stop();
    });

    it("should handle aria-busy attribute removal on a live region as completion of the busy period", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite" aria-busy="true">Loading</div>
      `;

      await virtual.start({ container: document.body });

      const live = document.getElementById("live")!;
      live.textContent = "Data loaded successfully";
      live.removeAttribute("aria-busy");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toBe(
          "polite: Data loaded successfully"
        );
      });

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "polite: Data loaded successfully",
      ]);

      await virtual.stop();
    });

    it("should suppress mutations in descendants when an ancestor is marked aria-busy", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite" aria-busy="true">
        <ul id="list">
          <li>Item 1</li>
        </ul>
      </div>
      `;

      await virtual.start({ container: document.body });

      const list = document.getElementById("list")!;
      const newItem = document.createElement("li");
      newItem.textContent = "Item 2";
      list.appendChild(newItem);

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);

      const live = document.getElementById("live")!;
      live.setAttribute("aria-busy", "false");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toContain("Item 2");
      });

      await virtual.stop();
    });

    it("should only announce the last aria-busy change when multiple mutations occur in the same batch", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite">Initial content</div>
      `;

      await virtual.start({ container: document.body });

      const live = document.getElementById("live")!;
      live.setAttribute("aria-busy", "true");
      live.setAttribute("aria-busy", "false");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toBe("polite: Initial content");
      });

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "polite: Initial content",
      ]);

      await virtual.stop();
    });

    it("should return empty string when child aria-busy clears but parent live region is still busy", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite" aria-busy="true">
        <button id="child" aria-busy="true">Action</button>
      </div>
      `;

      await virtual.start({ container: document.body });

      const child = document.getElementById("child")!;
      child.setAttribute("aria-busy", "false");

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);

      await virtual.stop();
    });

    it("should not announce spoken phrase when live region is empty after aria-busy clears", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite" aria-busy="true"></div>
      `;

      await virtual.start({ container: document.body });

      const live = document.getElementById("live")!;
      live.removeAttribute("aria-busy");

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);

      await virtual.stop();
    });

    it("should handle live region element with all four attributes: aria-live, aria-atomic, aria-busy, aria-relevant", async () => {
      document.body.innerHTML = `
      <div id="live" aria-live="polite" aria-atomic="true" aria-busy="true" aria-relevant="all">
        <span>Initial</span>
      </div>
      `;

      await virtual.start({ container: document.body });
      const live = document.getElementById("live")!;
      live.textContent = "Updated";
      live.setAttribute("aria-busy", "false");

      await waitFor(async () => {
        expect(await virtual.lastSpokenPhrase()).toBe("polite: Updated");
      });

      await virtual.stop();
    });
  });
});
