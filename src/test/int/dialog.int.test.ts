import { screen } from "@testing-library/dom";
import { virtual } from "../..";

function setupDialogPage() {
  document.body.innerHTML = `
  <div id="container">
    <button id="open-dialog-1">Open Dialog</button>
    <div role="dialog" id="dialog-1" aria-labelledby="dialog-1-title">
      <button type="button" id="close-dialog-1">Close Dialog 1</button>
      <h1 id="dialog-1-title">Dialog 1 Title</h1>
      <p id="dialog-1-content">Some dialog 1 content</p>
      <button type="button" id="dialog-1-other-btn">Other Dialog 1 Button</button>
    </div>
    <div role="dialog" id="dialog-2" aria-labelledby="dialog-2-title">
      <button type="button" id="close-dialog-2">Close Dialog 2</button>
      <h1 id="dialog-2-title">Dialog 2 Title</h1>
      <p id="dialog-2-content">Some dialog 2 content</p>
    </div>
  </div>
  `;

  document.querySelector("#open-dialog-1").addEventListener("click", () => {
    const closeButton = document.querySelector(
      "#close-dialog-1"
    ) as HTMLButtonElement;

    closeButton.focus();
  });
}

describe("dialog", () => {
  beforeEach(() => {
    setupDialogPage();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce a parent dialog when focus is moved into it for the first time", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });
    await virtual.act();
    await virtual.next();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Dialog",
      "dialog, Dialog 1 Title",
      "button, Close Dialog 1",
      "heading, Dialog 1 Title, level 1",
      "Some dialog 1 content",
    ]);
  });

  it("should announce a parent dialog when focus is moved into it for the first time from another dialog", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });

    await virtual.act();
    await virtual.next();

    // Force focus to the second dialog
    screen.getByRole("button", { name: "Close Dialog 2" }).focus();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Dialog",
      "dialog, Dialog 1 Title",
      "button, Close Dialog 1",
      "heading, Dialog 1 Title, level 1",
      "dialog, Dialog 2 Title",
      "button, Close Dialog 2",
      "heading, Dialog 2 Title, level 1",
    ]);
  });

  it("should not announce a parent dialog when focus is already in the dialog", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });

    await virtual.act();
    await virtual.next();

    // Force focus to another button in the first dialog
    screen.getByRole("button", { name: "Other Dialog 1 Button" }).focus();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Dialog",
      "dialog, Dialog 1 Title",
      "button, Close Dialog 1",
      "heading, Dialog 1 Title, level 1",
      "button, Other Dialog 1 Button",
      "end of dialog, Dialog 1 Title",
    ]);
  });
});
