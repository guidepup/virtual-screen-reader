/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

  it("should announce changes to the polite live region - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-2")!.focus();

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
      "button, Test aria-live polite",
      "polite: The assertive announcement should interrupt or follow this first announcement.",
      "polite: This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.",
      "polite: I am now populated aria-live=polite",
    ]);
  });

  it("should announce character data updates to the polite live region - applied to the contenteditable p element", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-2b")!.focus();

    await virtual.act();

    await waitFor(
      () => {
        expect(document.querySelector("#target-2b")?.textContent).toBe(
          "Existing Content updated aria-live=polite"
        );
      },
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-live polite",
      "polite: Existing Content",
      "polite: Existing Content u",
      "polite: Existing Content up",
      "polite: Existing Content upd",
      "polite: Existing Content upda",
      "polite: Existing Content updat",
      "polite: Existing Content update",
      "polite: Existing Content updated",
      "polite: Existing Content updated",
      "polite: Existing Content updated a",
      "polite: Existing Content updated ar",
      "polite: Existing Content updated ari",
      "polite: Existing Content updated aria",
      "polite: Existing Content updated aria-",
      "polite: Existing Content updated aria-l",
      "polite: Existing Content updated aria-li",
      "polite: Existing Content updated aria-liv",
      "polite: Existing Content updated aria-live",
      "polite: Existing Content updated aria-live=",
      "polite: Existing Content updated aria-live=p",
      "polite: Existing Content updated aria-live=po",
      "polite: Existing Content updated aria-live=pol",
      "polite: Existing Content updated aria-live=poli",
      "polite: Existing Content updated aria-live=polit",
      "polite: Existing Content updated aria-live=polite",
    ]);
  });

  // TODO: we don't actually interrupt currently, just denote that it is assertive.
  it("should convey the assertive value by interrupting the current announcement - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=assertive button
    document.querySelector<HTMLButtonElement>("#trigger-3")!.focus();

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
      "button, Test aria-live assertive",
      "polite: The assertive announcement should interrupt or follow this first announcement.",
      "polite: This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.",
      "assertive: I am now populated aria-live=assertive",
    ]);
  });

  it("should announce character data updates to the assertive live region - applied to the contenteditable p element", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-3b")!.focus();

    await virtual.act();

    await waitFor(
      () => {
        expect(document.querySelector("#target-3b")?.textContent).toBe(
          "Existing Content updated aria-live=assertive"
        );
      },
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-live assertive",
      "assertive: Existing Content",
      "assertive: Existing Content u",
      "assertive: Existing Content up",
      "assertive: Existing Content upd",
      "assertive: Existing Content upda",
      "assertive: Existing Content updat",
      "assertive: Existing Content update",
      "assertive: Existing Content updated",
      "assertive: Existing Content updated",
      "assertive: Existing Content updated a",
      "assertive: Existing Content updated ar",
      "assertive: Existing Content updated ari",
      "assertive: Existing Content updated aria",
      "assertive: Existing Content updated aria-",
      "assertive: Existing Content updated aria-l",
      "assertive: Existing Content updated aria-li",
      "assertive: Existing Content updated aria-liv",
      "assertive: Existing Content updated aria-live",
      "assertive: Existing Content updated aria-live=",
      "assertive: Existing Content updated aria-live=a",
      "assertive: Existing Content updated aria-live=as",
      "assertive: Existing Content updated aria-live=ass",
      "assertive: Existing Content updated aria-live=asse",
      "assertive: Existing Content updated aria-live=asser",
      "assertive: Existing Content updated aria-live=assert",
      "assertive: Existing Content updated aria-live=asserti",
      "assertive: Existing Content updated aria-live=assertiv",
      "assertive: Existing Content updated aria-live=assertive",
    ]);
  });

  it("conveys the off value by not announcing changes to the off live region - applied to the div element", async () => {
    await virtual.start({ container: document.body });

    // Navigate to aria-live=off button
    document.querySelector<HTMLButtonElement>("#trigger-1")!.focus();

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
      "button, Test aria-live off",
    ]);
  });

  it("conveys the off value by not announcing changes to the off live region - applied to the contenteditable p element", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-1b")!.focus();

    await virtual.act();

    await waitFor(
      () => {
        expect(document.querySelector("#target-1b")?.textContent).toBe(
          "Existing Content updated aria-live=off"
        );
      },
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test aria-live off",
    ]);
  });

  it("should handle the straight-forward case of being a fully marked up aria-live element (no parent traversal required)", async () => {
    await virtual.start({ container: document.body });

    document
      .querySelector<HTMLButtonElement>("#trigger-fully-defined")!
      .focus();

    await virtual.act();

    await waitFor(
      () => {
        expect(
          document.querySelector("#target-fully-defined")?.textContent
        ).toBe("I am now populated");
      },
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test fully defined",
      "polite: I am now populated",
    ]);
  });
});
