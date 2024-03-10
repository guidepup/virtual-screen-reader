import { screen, waitFor } from "@testing-library/dom";
import { setupAriaAtomic } from "./ariaAtomic.js";
import { virtual } from "../../src/index.js";

describe("Aria Atomic", () => {
  let teardown: () => void;

  describe("new nodes are divs", () => {
    beforeEach(() => {
      teardown = setupAriaAtomic("div");
    });

    afterEach(async () => {
      await virtual.stop();
      teardown();
    });

    it("should convey the false value by only announcing content that has changed - applied to the div element", async () => {
      await virtual.start({ container: document.body });

      // Navigate to aria-atomic=false button
      const button = screen.getByRole("button", {
        name: "Test aria-atomic false",
      });

      button.focus();

      await virtual.act();

      await waitFor(() =>
        expect(document.querySelector("#target-1 div")?.textContent).toContain(
          "what has changed"
        )
      );

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "button, Test aria-atomic false",
        "assertive: what has changed",
      ]);

      await virtual.stop();
    });

    it("should convey the true value by announcing all content - applied to the div element", async () => {
      await virtual.start({ container: document.body });

      // Navigate to aria-atomic=true button
      const button = screen.getByRole("button", {
        name: "Test aria-atomic true",
      });

      button.focus();

      await virtual.act();

      await waitFor(() =>
        expect(document.querySelector("#target-2 div")?.textContent).toContain(
          "entire region"
        )
      );

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "button, Test aria-atomic true",
        "assertive: Announce entire region",
      ]);

      await virtual.stop();
    });
  });

  describe("new nodes are spans", () => {
    beforeEach(() => {
      teardown = setupAriaAtomic("span");
    });

    afterEach(async () => {
      await virtual.stop();
      teardown();
    });

    it("should convey the false value by only announcing content that has changed - applied to the span element", async () => {
      await virtual.start({ container: document.body });

      // Navigate to aria-atomic=false button
      const button = screen.getByRole("button", {
        name: "Test aria-atomic false",
      });

      button.focus();

      await virtual.act();

      await waitFor(() =>
        expect(
          document.querySelector("#target-1 span:nth-child(2)")?.textContent
        ).toContain("what has changed")
      );

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "button, Test aria-atomic false",
        "assertive: what has changed",
      ]);

      await virtual.stop();
    });

    it("should convey the true value by announcing all content - applied to the span element", async () => {
      await virtual.start({ container: document.body });

      // Navigate to aria-atomic=true button
      const button = screen.getByRole("button", {
        name: "Test aria-atomic true",
      });

      button.focus();

      await virtual.act();

      await waitFor(() =>
        expect(
          document.querySelector("#target-2 span:nth-child(2)")?.textContent
        ).toContain("entire region")
      );

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "button, Test aria-atomic true",
        "assertive: Announce entire region",
      ]);

      await virtual.stop();
    });
  });
});
