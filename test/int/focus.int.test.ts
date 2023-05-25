import { getByText } from "@testing-library/dom";
import { virtual } from "../../src";

function setupFocusChangePage() {
  document.body.innerHTML = `
  <div id="container">
    <button id="1">1</button>
    <button id="2">2</button>
    <label for="3">3 label</label>
    <input id="3" type="text" value="3" />
    <label for="4">4 label</label>
    <input id="4" type="button" value="4" />
    <textarea id="5">5</textarea>
    <a id="6" href="#">6</a>
    <button id="hidden1" aria-hidden="true">hidden 1</button>
  </div>
  <button id="outside1">outside 1</button>
  `;
}

describe("click", () => {
  beforeEach(() => {
    setupFocusChangePage();
  });

  it("should update the screen reader position when a node not currently active for the screen reader is focussed", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });

    expect(await virtual.lastSpokenPhrase()).toEqual("button, 1");

    getByText(container, "4").focus();
    expect(await virtual.lastSpokenPhrase()).toEqual("button, 4");

    await virtual.previous();
    await virtual.previous();
    expect(await virtual.lastSpokenPhrase()).toEqual("textbox, 3 label");

    getByText(container, "6").focus();
    expect(await virtual.lastSpokenPhrase()).toEqual("link, 6");

    await virtual.previous();
    expect(await virtual.lastSpokenPhrase()).toEqual("end of textbox");

    await virtual.stop();
  });

  it("should not shift the screen reader active node if focus shifted outside the container", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });

    expect(await virtual.lastSpokenPhrase()).toEqual("button, 1");

    getByText(document.body, "outside 1").focus();
    expect(await virtual.lastSpokenPhrase()).toEqual("button, 1");

    await virtual.stop();
  });

  it("should not shift the screen reader active node if focus shifted to a node hidden from screen readers", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#container")! as HTMLElement;

    await virtual.start({ container });

    expect(await virtual.lastSpokenPhrase()).toEqual("button, 1");

    getByText(document.body, "hidden 1").focus();
    expect(await virtual.lastSpokenPhrase()).toEqual("button, 1");

    await virtual.stop();
  });
});
