import { setupAriaLive } from "./ariaLive";
import { virtual } from "../../src";
import { waitFor } from "@testing-library/dom";

describe("Aria Live", () => {
  let teardown;

  beforeEach(() => {
    teardown = setupAriaLive();
  });

  afterEach(async () => {
    await virtual.stop();
    teardown();
  });

  it("should announce changes to the live region - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=polite button
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-2")?.textContent).toBe(
          "I am now populated aria-live=polite"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, aria-live=off, level 2",
      "button, Test aria-live off",
      "heading, aria-live=polite, level 2",
      "button, Test aria-live polite",
      "polite: The assertive announcement should interrupt or follow this first announcement.",
      "polite: This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.",
      "polite: I am now populated aria-live=polite",
    ]);

    await virtual.stop();
  });

  it("should convey the assertive value by interrupting the current announcement - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=assertive button
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-3")?.textContent).toBe(
          "I am now populated aria-live=assertive"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, aria-live=off, level 2",
      "button, Test aria-live off",
      "heading, aria-live=polite, level 2",
      "button, Test aria-live polite",
      "heading, aria-live=assertive, level 2",
      "button, Test aria-live assertive",
      "polite: The assertive announcement should interrupt or follow this first announcement.",
      "polite: This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.",
      "assertive: I am now populated aria-live=assertive",
    ]);

    await virtual.stop();
  });

  it("convey the off value by not announcing changes to the live region - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=off button
    await virtual.next();
    await virtual.next();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-1")?.textContent).toBe(
          "I am now populated aria-live=off"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, aria-live=off, level 2",
      "button, Test aria-live off",
    ]);

    await virtual.stop();
  });
});
