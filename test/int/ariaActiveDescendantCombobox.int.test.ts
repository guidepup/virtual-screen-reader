import { setupComboboxWithListAutocomplete } from "./comboboxWithListAutocomplete.js";
import { virtual } from "../../src/index.js";

describe("Aria Active Descendant", () => {
  let teardown: () => void;

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
      "combobox, State, has popup listbox, not expanded, autocomplete in list, 1 control",
      "combobox, State, has popup listbox, expanded, autocomplete in list, 1 control",
      "combobox, State, nebr, has popup listbox, expanded, autocomplete in list, 1 control",
      "combobox, State, nebr, has popup listbox, expanded, active descendant Nebraska, autocomplete in list, 1 control",
    ]);
  });
});
