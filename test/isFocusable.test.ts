import { FOCUSABLE_SELECTOR, isFocusable } from "../src/isFocusable";

describe("isFocusable", () => {
  it("should identify focusable elements correctly", () => {
    document.body.innerHTML = `
      <input type="text" id="input1" />
      <input type="hidden" id="hidden1" />
      <input type="text" disabled id="disabledInput" />
      <button id="btn1">Button</button>
      <button disabled id="disabledBtn">Disabled Button</button>
      <select id="select1"><option>1</option></select>
      <select disabled id="disabledSelect"><option>1</option></select>
      <textarea id="textarea1"></textarea>
      <textarea disabled id="disabledTextarea"></textarea>
      <div contenteditable="" id="ce1">Editable</div>
      <div contenteditable="true" id="ce2">Editable 2</div>
      <a href="#" id="link1">Link</a>
      <a id="notLink">Not a link</a>
      <div tabindex="0" id="tabindex0">Tabindex 0</div>
      <div tabindex="-1" id="tabindexMinus1">Tabindex -1</div>
      <div tabindex="0" disabled id="disabledTabindex">Disabled Tabindex</div>
      <p id="para">Plain paragraph</p>
    `;

    expect(isFocusable(document.getElementById("input1")!)).toBe(true);
    expect(isFocusable(document.getElementById("hidden1")!)).toBe(false);
    expect(isFocusable(document.getElementById("disabledInput")!)).toBe(false);
    expect(isFocusable(document.getElementById("btn1")!)).toBe(true);
    expect(isFocusable(document.getElementById("disabledBtn")!)).toBe(false);
    expect(isFocusable(document.getElementById("select1")!)).toBe(true);
    expect(isFocusable(document.getElementById("disabledSelect")!)).toBe(false);
    expect(isFocusable(document.getElementById("textarea1")!)).toBe(true);
    expect(isFocusable(document.getElementById("disabledTextarea")!)).toBe(false);
    expect(isFocusable(document.getElementById("ce1")!)).toBe(true);
    expect(isFocusable(document.getElementById("ce2")!)).toBe(true);
    expect(isFocusable(document.getElementById("link1")!)).toBe(true);
    expect(isFocusable(document.getElementById("notLink")!)).toBe(false);
    expect(isFocusable(document.getElementById("tabindex0")!)).toBe(true);
    expect(isFocusable(document.getElementById("tabindexMinus1")!)).toBe(true);
    expect(isFocusable(document.getElementById("para")!)).toBe(false);
    expect(FOCUSABLE_SELECTOR).toBeDefined();
  });
});
