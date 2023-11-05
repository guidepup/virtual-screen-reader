/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupLiveRegionRoles } from "./liveRegionRoles";
import { virtual } from "../..";
import { waitFor } from "@testing-library/dom";

describe("Live Region Roles", () => {
  let teardown;

  beforeEach(() => {
    teardown = setupLiveRegionRoles();
  });

  afterEach(async () => {
    await virtual.stop();
    teardown();
  });

  it("should treat role=alert as an atomic, assertive live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-alert")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-alert")?.textContent).toBe(
          "Initial Content Populated role=alert"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test alert role",
      "assertive: Initial Content Populated role=alert",
    ]);
  });

  it("should treat role=alert with aria-atomic=false as a non-atomic, assertive live region", async () => {
    await virtual.start({ container: document.body });

    document
      .querySelector<HTMLButtonElement>("#trigger-alert-non-atomic")!
      .focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(
          document.querySelector("#target-alert-non-atomic")?.textContent
        ).toBe("Initial Content Populated role=alert"),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test alert role",
      "assertive: Populated role=alert",
    ]);
  });

  it("should treat role=log as a polite live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-log")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-log")?.textContent).toBe(
          "Initial Content Populated role=log"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test log role",
      "polite: Populated role=log",
    ]);
  });

  it("should treat role=marquee as an off live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-marquee")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-marquee")?.textContent).toBe(
          "Initial Content Populated role=marquee"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test marquee role",
    ]);
  });

  it("should treat role=status as an atomic, polite live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-status")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-status")?.textContent).toBe(
          "Initial Content Populated role=status"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test status role",
      "polite: Initial Content Populated role=status",
    ]);
  });

  it("should treat role=status with aria-atomic=false as a non-atomic, polite live region", async () => {
    await virtual.start({ container: document.body });

    document
      .querySelector<HTMLButtonElement>("#trigger-status-non-atomic")!
      .focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(
          document.querySelector("#target-status-non-atomic")?.textContent
        ).toBe("Initial Content Populated role=status"),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test status role",
      "polite: Populated role=status",
    ]);
  });

  it("should treat role=timer as an off live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-timer")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-timer")?.textContent).toBe(
          "Initial Content Populated role=timer"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test timer role",
    ]);
  });

  it("should treat role=alertdialog as an atomic, assertive live region", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-alertdialog")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(document.querySelector("#target-alertdialog")?.textContent).toBe(
          "Initial Content Populated role=alertdialog"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test alertdialog role",
      "assertive: Initial Content Populated role=alertdialog",
    ]);
  });

  it("should treat role=alertdialog with aria-atomic=false as a non-atomic, assertive live region", async () => {
    await virtual.start({ container: document.body });

    document
      .querySelector<HTMLButtonElement>("#trigger-alertdialog-non-atomic")!
      .focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(
          document.querySelector("#target-alertdialog-non-atomic")?.textContent
        ).toBe("Initial Content Populated role=alertdialog"),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Test alertdialog role",
      "assertive: Populated role=alertdialog",
    ]);
  });
});
