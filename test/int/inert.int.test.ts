import { virtual } from "../../src/index.js";

describe("inert", () => {
  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  it("should hide inert elements from the tree unless they are modal dialog (non-native)", async () => {
    document.body.innerHTML = `<p>visible paragraph</p>
<p inert>hidden paragraph</p>

<!-- Explicitly inert modal dialog should be inert -->
<div aria-labelledby="dialog-heading-1" aria-modal="true" inert role="dialog">
  <h1 id="dialog-heading-1">hidden dialog heading 1</h1>
</div>

<!-- Explicitly inert dialog should be inert -->
<div aria-labelledby="dialog-heading-2" inert role="dialog">
  <h1 id="dialog-heading-2">hidden dialog heading 2</h1>
</div>

<div inert>
  <p>hidden paragraph</p>

  <!-- Explicitly inert modal dialog should be inert -->
  <div aria-labelledby="dialog-heading-3" aria-modal="true" inert role="dialog">
    <h1 id="dialog-heading-3">hidden dialog heading 3</h1>
  </div>

  <!-- Non-modal dialog should inherit inert -->
  <div aria-labelledby="dialog-heading-4" role="dialog">
    <h1 id="dialog-heading-4">hidden dialog heading 4</h1>
  </div>

  <!-- Modal dialog should not inherit inert -->
  <div aria-labelledby="dialog-heading-5" aria-modal="true" role="dialog">
    <h1 id="dialog-heading-5">visible dialog heading 5</h1>
  </div>
</div>
`;

    await virtual.start({ container: document.body });

    while (
      (await virtual.lastSpokenPhrase()) !==
      "end of dialog, visible dialog heading 5, modal"
    ) {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "paragraph",
      "visible paragraph",
      "end of paragraph",
      "dialog, visible dialog heading 5, modal",
      "dialog, visible dialog heading 5, modal",
      "heading, visible dialog heading 5, level 1",
      "end of dialog, visible dialog heading 5, modal",
    ]);
  });

  it("should hide inert elements from the tree unless they are modal dialog (native approximation assuming used `openModel()` method)", async () => {
    document.body.innerHTML = `<p>visible paragraph</p>
<p inert>hidden paragraph</p>

<!-- Explicitly inert open dialog should be inert -->
<dialog aria-labelledby="dialog-heading-1" inert open>
  <h1 id="dialog-heading-1">hidden dialog heading 1</h1>
</dialog>

<!-- Explicitly inert closed dialog should be inert -->
<dialog aria-labelledby="dialog-heading-2" inert>
  <h1 id="dialog-heading-2">hidden dialog heading 2</h1>
</dialog>

<div inert>
  <p>hidden paragraph</p>

  <!-- Explicitly inert open dialog should be inert -->
  <dialog aria-labelledby="dialog-heading-3" inert open>
    <h1 id="dialog-heading-3">hidden dialog heading 3</h1>
  </dialog>

  <!-- Closed dialog should inherit inert -->
  <dialog aria-labelledby="dialog-heading-4">
    <h1 id="dialog-heading-4">hidden dialog heading 4</h1>
  </dialog>

  <!-- Open dialog should not inherit inert -->
  <dialog aria-labelledby="dialog-heading-5" open>
    <h1 id="dialog-heading-5">visible dialog heading 5</h1>
  </dialog>
</div>
`;

    await virtual.start({ container: document.body });

    while (
      (await virtual.lastSpokenPhrase()) !==
      "end of dialog, visible dialog heading 5"
    ) {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "paragraph",
      "visible paragraph",
      "end of paragraph",
      "dialog, visible dialog heading 5",
      "dialog, visible dialog heading 5",
      "heading, visible dialog heading 5, level 1",
      "end of dialog, visible dialog heading 5",
    ]);
  });
});
