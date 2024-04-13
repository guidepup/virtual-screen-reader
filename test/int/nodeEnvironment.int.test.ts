/**
 * @jest-environment node
 */
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextDecoder, TextEncoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });

import jsdom from "jsdom";
import { virtual } from "../../src/index.js";
import { waitFor } from "@testing-library/dom";

describe("Node Environment", () => {
  let dom: jsdom.JSDOM;

  beforeEach(() => {
    globalThis.window = undefined as any;

    const { JSDOM } = jsdom;

    dom = new JSDOM(
      `<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <nav>Nav Text</nav>
    <main>
      <p id="target" contenteditable="true" aria-live="polite">Edit this text!</p>
    </main>
    <footer>Footer</footer>
  </body>
</html>`
    );
  });

  afterEach(async () => {
    await virtual.stop();

    // Some hackery to ensure Testing Library jest-dom helpers don't fall over
    // as they expect window.navigator to be defined for some clipboard cleanup
    // in some global afterAll hooks they add to jest.
    globalThis.window = {
      navigator: {} as any,
    } as any;
  });

  describe("when no window global is provided", () => {
    beforeEach(async () => {
      await virtual.start({
        container: dom.window.document.body,
        window: undefined,
      });
    });

    it("should handle commands gracefully", async () => {
      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.itemTextLog()).toEqual([
        "",
        "",
        "Nav Text",
        "",
        "",
        "",
        "Edit this text!",
        "",
        "",
        "",
        "Footer",
        "",
        "",
      ]);

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "navigation",
        "Nav Text",
        "end of navigation",
        "main",
        "paragraph",
        "Edit this text!",
        "end of paragraph",
        "end of main",
        "contentinfo",
        "Footer",
        "end of contentinfo",
        "end of document",
      ]);
    });

    it("should handle live regions gracefully without observing nor announcing the live region changes", async () => {
       
      dom.window.document.querySelector("#target")!.textContent = "Updated";

      await waitFor(
        () =>
          expect(
            dom.window.document.querySelector("#target")?.textContent
          ).toBe("Updated"),
        { container: dom.window.document.body, timeout: 7000 }
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
    });
  });

  describe("when a window global is provided", () => {
    beforeEach(async () => {
      await virtual.start({
        container: dom.window.document.body,
        window: dom.window,
      });
    });

    it("should handle commands gracefully", async () => {
      while ((await virtual.lastSpokenPhrase()) !== "end of document") {
        await virtual.next();
      }

      expect(await virtual.itemTextLog()).toEqual([
        "",
        "",
        "Nav Text",
        "",
        "",
        "",
        "Edit this text!",
        "",
        "",
        "",
        "Footer",
        "",
        "",
      ]);

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "navigation",
        "Nav Text",
        "end of navigation",
        "main",
        "paragraph",
        "Edit this text!",
        "end of paragraph",
        "end of main",
        "contentinfo",
        "Footer",
        "end of contentinfo",
        "end of document",
      ]);
    });

    it("should handle live regions gracefully", async () => {
       
      dom.window.document.querySelector("#target")!.textContent = "Updated";

      await waitFor(
        () =>
          expect(
            dom.window.document.querySelector("#target")?.textContent
          ).toBe("Updated"),
        { container: dom.window.document.body, timeout: 7000 }
      );

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "polite: Updated",
      ]);
    });
  });
});
