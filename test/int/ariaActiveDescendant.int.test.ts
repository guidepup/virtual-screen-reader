import { virtual } from "../../src/index.js";

describe("Aria Active Descendant", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should handle a simple combobox", async () => {
    document.body.innerHTML = `
    <input type="text" aria-activedescendant="cb1-opt6" aria-readonly="true" aria-owns="cb1-list" aria-autocomplete="list" role="combobox" id="cb1-edit">
    <ul aria-expanded="true" role="listbox" id="cb1-list">
      <li role="option" id="cb1-opt1">Alabama</li>
      <li role="option" id="cb1-opt2">Alaska</li>
      <li role="option" id="cb1-opt3">American Samoa</li>
      <li role="option" id="cb1-opt4">Arizona</li>
      <li role="option" id="cb1-opt5">Arkansas</li>
      <li role="option" id="cb1-opt6">California</li>
      <li role="option" id="cb1-opt7">Colorado</li>
    </ul>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "combobox, has popup listbox, not expanded, active descendant California, autocomplete in list, read only",
    ]);

    await virtual.stop();
  });

  it("should gracefully handle an invalid idRef", async () => {
    document.body.innerHTML = `
    <input type="text" aria-activedescendant="cb1-opt8" aria-readonly="true" aria-owns="cb1-list" aria-autocomplete="list" role="combobox" id="cb1-edit">
    <ul aria-expanded="true" role="listbox" id="cb1-list">
      <li role="option" id="cb1-opt1">Alabama</li>
      <li role="option" id="cb1-opt2">Alaska</li>
      <li role="option" id="cb1-opt3">American Samoa</li>
      <li role="option" id="cb1-opt4">Arizona</li>
      <li role="option" id="cb1-opt5">Arkansas</li>
      <li role="option" id="cb1-opt6">California</li>
      <li role="option" id="cb1-opt7">Colorado</li>
    </ul>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "combobox, has popup listbox, not expanded, autocomplete in list, read only",
    ]);

    await virtual.stop();
  });
});
