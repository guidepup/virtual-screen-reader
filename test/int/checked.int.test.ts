import { virtual } from "../../src";

describe("Checked Attribute State", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce that a checkbox with a checked attribute is 'checked'", async () => {
    document.body.innerHTML = `
    <fieldset>
      <legend>Choose your monster's features:</legend>

      <div>
        <input type="checkbox" id="scales" name="scales" checked>
        <label for="scales">Scales</label>
      </div>

      <div>
        <input type="checkbox" id="horns" name="horns">
        <label for="horns">Horns</label>
      </div>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Scales, checked");

    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, Horns, not checked"
    );

    await virtual.stop();
  });

  it("should announce that a checkbox with a checked attribute set to true is 'checked'", async () => {
    document.body.innerHTML = `
    <fieldset>
      <legend>Choose your monster's features:</legend>

      <div>
        <input type="checkbox" id="scales" name="scales" checked="true">
        <label for="scales">Scales</label>
      </div>

      <div>
        <input type="checkbox" id="horns" name="horns">
        <label for="horns">Horns</label>
      </div>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Scales, checked");

    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, Horns, not checked"
    );

    await virtual.stop();
  });

  it("should announce that a checkbox with a checked attribute set to false is 'not checked'", async () => {
    document.body.innerHTML = `
    <fieldset>
      <legend>Choose your monster's features:</legend>

      <div>
        <input type="checkbox" id="scales" name="scales" checked="false">
        <label for="scales">Scales</label>
      </div>

      <div>
        <input type="checkbox" id="horns" name="horns">
        <label for="horns">Horns</label>
      </div>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, Scales, not checked"
    );

    await virtual.stop();
  });

  it("should announce that a checkbox with an aria-checked attribute set to true is 'checked'", async () => {
    document.body.innerHTML = `
    <fieldset>
      <legend>Choose your monster's features:</legend>

      <div>
        <input type="checkbox" id="scales" name="scales" aria-checked="true">
        <label for="scales">Scales</label>
      </div>

      <div>
        <input type="checkbox" id="horns" name="horns">
        <label for="horns">Horns</label>
      </div>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Scales, checked");

    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, Horns, not checked"
    );

    await virtual.stop();
  });

  it("should announce that a checkbox with an aria-checked attribute set to false is 'not checked'", async () => {
    document.body.innerHTML = `
    <fieldset>
      <legend>Choose your monster's features:</legend>

      <div>
        <input type="checkbox" id="scales" name="scales" aria-checked="false">
        <label for="scales">Scales</label>
      </div>

      <div>
        <input type="checkbox" id="horns" name="horns">
        <label for="horns">Horns</label>
      </div>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, Scales, not checked"
    );

    await virtual.stop();
  });

  it("should handle a checkbox with an aria-checked attribute set to mixed", async () => {
    // REF: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/
    document.body.innerHTML = `
    <fieldset class="checkbox-mixed">
      <legend>
        Sandwich Condiments
      </legend>
      <div role="checkbox"
          class="group_checkbox"
          aria-checked="mixed"
          aria-controls="cond1 cond2 cond3 cond4"
          tabindex="0">
        All condiments
      </div>
      <ul class="checkboxes">
        <li>
          <label>
            <input type="checkbox" id="cond1">
            Lettuce
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox"
                  id="cond2"
                  checked="">
            Tomato
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" id="cond3">
            Mustard
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" id="cond4">
            Sprouts
          </label>
        </li>
      </ul>
    </fieldset>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "checkbox, All condiments, partially checked, 4 controls"
    );

    await virtual.stop();
  });

  it("should ignore an invalid 'checked' property on an element + properties combination that doesn't support it", async () => {
    document.body.innerHTML = `
      <input role="checkbox" type="text" value="Some text" checked />
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Some text");

    await virtual.stop();
  });
});
