import { setupComboboxWithListAutocomplete } from './comboboxWithListAutocomplete.js';
import { virtual } from '../../src/index.js';

describe("Aria Active Descendant", () => {
  let teardown;

  beforeEach(() => {
    teardown = setupComboboxWithListAutocomplete();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
    teardown();
  });

  it("should handle an editable combobox with list autocomplete", async () => {
    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.type("nebr");
    await virtual.press("ArrowDown");

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "State",
      "combobox, State, autocomplete in list, not expanded, has popup listbox, 1 control",
      "combobox, State, autocomplete in list, expanded, has popup listbox, 1 control",
      "combobox, State, nebr, autocomplete in list, expanded, has popup listbox, 1 control",
      "combobox, State, nebr, active descendant Nebraska, autocomplete in list, expanded, has popup listbox, 1 control",
    ]);
  });
});
