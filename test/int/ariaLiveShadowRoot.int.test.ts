import { virtual } from "../../src/index.js";
import { waitFor } from "@testing-library/dom";

const MESSAGE = "Please enter a valid IBAN.";

/**
 * A live region on the host element, with the content it announces rendered
 * inside that host's shadow root - the shape a web component uses when it
 * renders its own feedback (Lion's `lion-validation-feedback`, for example).
 */
function setupHostLiveRegion() {
  document.body.innerHTML = `
  <button id="trigger-1">Trigger host live region</button>
  <div id="host-1" aria-live="assertive" aria-atomic="false"></div>

  <button id="trigger-2">Trigger shadow live region</button>
  <div id="host-2"></div>
  `;

  const host1 = document.getElementById("host-1")!;
  const host2 = document.getElementById("host-2")!;

  host1.attachShadow({ mode: "open" });
  host2.attachShadow({ mode: "open" }).innerHTML = "<div id=\"target-2\" aria-live=\"polite\"></div>";

  document.getElementById("trigger-1")!.addEventListener("click", () => {
    // replaces the children of the shadow root, so the mutation target is the
    // ShadowRoot itself
    host1.shadowRoot!.innerHTML = `<span>${MESSAGE}</span>`;
  });

  document.getElementById("trigger-2")!.addEventListener("click", () => {
    // a text change inside the shadow root, so the walk up to the host of the
    // live region has to cross the shadow boundary
    host2.shadowRoot!.getElementById("target-2")!.textContent = MESSAGE;
  });

  return () => {
    document.body.innerHTML = "";
  };
}

describe("Aria Live inside a shadow root", () => {
  let teardown: () => void;

  beforeEach(() => {
    teardown = setupHostLiveRegion();
  });

  afterEach(async () => {
    await virtual.stop();
    teardown();
  });

  it("should announce changes to a live region that renders its content in its own shadow root", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-1")!.focus();

    await virtual.act();

    await waitFor(
      () => expect(document.getElementById("host-1")!.shadowRoot!.textContent).toBe(MESSAGE),
      { timeout: 7000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Trigger host live region",
      `assertive: ${MESSAGE}`,
    ]);
  });

  it("should announce changes to a live region inside the shadow root of an ancestor", async () => {
    await virtual.start({ container: document.body });

    document.querySelector<HTMLButtonElement>("#trigger-2")!.focus();

    await virtual.act();

    await waitFor(
      () =>
        expect(
          document.getElementById("host-2")!.shadowRoot!.querySelector("#target-2")!.textContent
        ).toBe(MESSAGE),
      { timeout: 7000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Trigger shadow live region",
      `polite: ${MESSAGE}`,
    ]);
  });
});
