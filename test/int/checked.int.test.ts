import { virtual } from "../../src";

describe("Checked Attribute State", () => {
  afterEach(async () => {
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

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Horns");

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

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Horns");

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

    expect(await virtual.lastSpokenPhrase()).toBe("checkbox, Horns");

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
});
