import { virtual } from "../../src";

describe("Checked Attribute State", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce that a button with an aria-pressed attribute set to true is 'pressed'", async () => {
    document.body.innerHTML = `
    <button aria-pressed="true">Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause, pressed");

    await virtual.stop();
  });

  it("should announce that a button with an aria-pressed attribute set to false is 'not pressed'", async () => {
    document.body.innerHTML = `
    <button aria-pressed="false">Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause, not pressed");

    await virtual.stop();
  });

  it("should announce a button without an aria-pressed attribute without any pressed state labelling", async () => {
    document.body.innerHTML = `
    <button>Pause</button>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe("button, Pause");

    await virtual.stop();
  });

  it("should handle a button with an aria-pressed attribute set to mixed", async () => {
    document.body.innerHTML = `
    <fieldset class="button-mixed">
      <legend>
        Power Plant Controls
      </legend>
      <div role="button"
          class="group_button"
          aria-pressed="mixed"
          aria-controls="cond1 cond2 cond3"
          tabindex="0">
        All systems
      </div>
      <ul class="buttons">
        <li>
          <label>
            <button id="cond1">
            Reactor
          </label>
        </li>
        <li>
          <label>
            <button
                  id="cond2"
                  aria-pressed="">
            Coolant
          </label>
        </li>
        <li>
          <label>
            <button id="cond3">
            Generator
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
      "button, All systems, partially pressed"
    );

    await virtual.stop();
  });
});
