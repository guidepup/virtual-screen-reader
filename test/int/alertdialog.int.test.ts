import { screen } from "@testing-library/dom";
import { virtual } from "../../src/index.js";

function setupDialogPage() {
  document.body.innerHTML = `
  <div id="container">
    <button id="open-alertdialog-1">Open Alert Dialog</button>
    <div role="alertdialog" id="alertdialog-1" aria-labelledby="alertdialog-1-title">
      <button type="button" id="close-alertdialog-1">Close Alert Dialog 1</button>
      <h1 id="alertdialog-1-title">Alert Dialog 1 Title</h1>
      <p id="alertdialog-1-content">Some alertdialog 1 content</p>
      <button type="button" id="alertdialog-1-other-btn">Other Alert Dialog 1 Button</button>
    </div>
    <div role="alertdialog" id="alertdialog-2" aria-labelledby="alertdialog-2-title">
      <button type="button" id="close-alertdialog-2">Close Alert Dialog 2</button>
      <h1 id="alertdialog-2-title">Alert Dialog 2 Title</h1>
      <p id="alertdialog-2-content">Some alertdialog 2 content</p>
    </div>
  </div>
  `;

  document
    .querySelector("#open-alertdialog-1")!
    .addEventListener("click", () => {
      const closeButton = document.querySelector(
        "#close-alertdialog-1"
      ) as HTMLButtonElement;

      closeButton.focus();
    });
}

describe("alertdialog", () => {
  beforeEach(() => {
    setupDialogPage();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce a parent alertdialog when focus is moved into it for the first time", async () => {
     
    const container = document.querySelector("#container")!;

    await virtual.start({ container });
    await virtual.act();
    await virtual.next();
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Alert Dialog",
      "alertdialog, Alert Dialog 1 Title",
      "button, Close Alert Dialog 1",
      "heading, Alert Dialog 1 Title, level 1",
      "paragraph",
      "Some alertdialog 1 content",
      "end of paragraph",
    ]);
  });

  it("should announce a parent alertdialog when focus is moved into it for the first time from another alertdialog", async () => {
     
    const container = document.querySelector("#container")!;

    await virtual.start({ container });

    await virtual.act();
    await virtual.next();

    // Force focus to the second alertdialog
    screen.getByRole("button", { name: "Close Alert Dialog 2" }).focus();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Alert Dialog",
      "alertdialog, Alert Dialog 1 Title",
      "button, Close Alert Dialog 1",
      "heading, Alert Dialog 1 Title, level 1",
      "alertdialog, Alert Dialog 2 Title",
      "button, Close Alert Dialog 2",
      "heading, Alert Dialog 2 Title, level 1",
    ]);
  });

  it("should not announce a parent alertdialog when focus is already in the alertdialog", async () => {
     
    const container = document.querySelector("#container")!;

    await virtual.start({ container });

    await virtual.act();
    await virtual.next();

    // Force focus to another button in the first alertdialog
    screen.getByRole("button", { name: "Other Alert Dialog 1 Button" }).focus();
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "button, Open Alert Dialog",
      "alertdialog, Alert Dialog 1 Title",
      "button, Close Alert Dialog 1",
      "heading, Alert Dialog 1 Title, level 1",
      "button, Other Alert Dialog 1 Button",
      "end of alertdialog, Alert Dialog 1 Title",
    ]);
  });
});
