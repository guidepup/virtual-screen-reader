import { virtual } from "../..";
import { waitFor } from "@testing-library/dom";

describe("Aria Live - Content Editable", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <p id="target" contenteditable="true" aria-live="polite">Edit this text!</p>
    `;

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = ``;
  });

  it("should announce changes to a live region - applied to the contenteditable element", async () => {
    await virtual.next();
    await virtual.type(" And announce!");

    await waitFor(
      () =>
        expect(document.querySelector("#target")?.textContent).toBe(
          "Edit this text! And announce!"
        ),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Edit this text!",
      "polite: Edit this text!",
      "polite: Edit this text! A",
      "polite: Edit this text! An",
      "polite: Edit this text! And",
      "polite: Edit this text! And",
      "polite: Edit this text! And a",
      "polite: Edit this text! And an",
      "polite: Edit this text! And ann",
      "polite: Edit this text! And anno",
      "polite: Edit this text! And annou",
      "polite: Edit this text! And announ",
      "polite: Edit this text! And announc",
      "polite: Edit this text! And announce",
      "polite: Edit this text! And announce!",
      "Edit this text! And announce!",
    ]);
  });
});

describe("Aria Live - All Attributes", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <div aria-live="assertive" aria-relevant="additions" aria-atomic="true">
      <p id="target" aria-live="polite" aria-relevant="text" aria-atomic="false"></p>
    </div>
    `;

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = ``;
  });

  it("should announce changes to a live region - all attributes short-circuit", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector("#target")!.textContent = "Updated";

    await waitFor(
      () =>
        expect(document.querySelector("#target")?.textContent).toBe("Updated"),
      { timeout: 5000 }
    );

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "polite: Updated",
    ]);
  });
});
