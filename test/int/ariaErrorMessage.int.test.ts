import { virtual } from "../../src/index.js";

describe("Aria Error Message", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- Initial valid state -->
    <label for="invalid-false">Input with aria-invalid="false"</label>
    <input id="invalid-false" type="text" aria-errormessage="invalid-false-msg" value="" aria-invalid="false">
    <div id="invalid-false-msg" style="visibility:hidden">example error text</div>

    <!-- User has input an invalid value -->
    <label for="invalid-true">Input with aria-invalid="true"</label>
    <input id="invalid-true" type="text" aria-errormessage="invalid-true-msg" aria-invalid="true" value="" >
    <div id="invalid-true-msg">example error text</div>

    <h2>Reference input with aria-invalid="true" but no aria-errormessage</h2>
    <p>It may not always be clear if aria-invalid="true" is being conveyed" or if aria-errormessage is being conveyed, or both. So the following is used as a reference.</p>
    <label for="reference-input">Reference input</label>
    <input id="reference-input" type="text" aria-invalid="true" value="">
    `;

    await virtual.start({ container: document.body });
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it('should not convey the error when the error message is NOT pertinent - applied to the input[type="text"] element', async () => {
    document.querySelector<HTMLInputElement>("#invalid-false")!.focus();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'textbox, Input with aria-invalid="false", not invalid',
    ]);
  });

  it('should convey that the referenced error message is pertinent - applied to the input[type="text"] element', async () => {
    document.querySelector<HTMLInputElement>("#invalid-true")!.focus();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      'textbox, Input with aria-invalid="true", 1 error message, invalid',
    ]);
  });
});
