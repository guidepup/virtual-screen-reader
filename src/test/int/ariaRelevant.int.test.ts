import { screen, waitFor } from "@testing-library/dom";
import { setupAriaRelevant } from "./ariaRelevant";
import { virtual } from "../..";

describe("Aria Relevant", () => {
  let teardown;

  beforeEach(() => {
    teardown = setupAriaRelevant();
  });

  afterEach(async () => {
    await virtual.stop();
    teardown();
  });

  it("should convey the 'additions' value - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    const button = screen.getByRole("button", {
      name: "Test aria-relevant additions",
    });

    button.focus();

    await virtual.act();

    await waitFor(() =>
      expect(
        document.querySelector("#target-0 [data-change]")?.textContent
      ).toBe("Content changed")
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-relevant additions",
      "assertive: DOM was added",
    ]);

    await virtual.stop();
  });

  it("should convey the 'additions text' combination - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    const button = screen.getByRole("button", {
      name: "Test aria-relevant additions text",
    });

    button.focus();

    await virtual.act();

    await waitFor(() =>
      expect(
        document.querySelector("#target-4 [data-change]")?.textContent
      ).toBe("Content changed")
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-relevant additions text",
      "assertive: DOM was added",
      "assertive: Content changed",
    ]);

    await virtual.stop();
  });

  it("should convey the 'all' value - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    const button = screen.getByRole("button", {
      name: "Test aria-relevant all",
    });

    button.focus();

    await virtual.act();

    await waitFor(() =>
      expect(
        document.querySelector("#target-3 [data-change]")?.textContent
      ).toBe("Content changed")
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-relevant all",
      "assertive: DOM was added",
      "assertive: removal: DOM was removed",
      "assertive: Content changed",
    ]);

    await virtual.stop();
  });

  it("should convey the 'removals' value - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    const button = screen.getByRole("button", {
      name: "Test aria-relevant removals",
    });

    button.focus();

    await virtual.act();

    await waitFor(() =>
      expect(
        document.querySelector("#target-1 [data-change]")?.textContent
      ).toBe("Content changed")
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-relevant removals",
      "assertive: removal: DOM was removed",
    ]);

    await virtual.stop();
  });

  it("should convey the 'text' value - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    const button = screen.getByRole("button", {
      name: "Test aria-relevant text",
    });

    button.focus();

    await virtual.act();

    await waitFor(() =>
      expect(
        document.querySelector("#target-2 [data-change]")?.textContent
      ).toBe("Content changed")
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-relevant text",
      "assertive: Content changed",
    ]);

    await virtual.stop();
  });
});
