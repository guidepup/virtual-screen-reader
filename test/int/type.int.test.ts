import { getByRole } from "@testing-library/dom";
import { virtual } from "../../src";

function setupInputPage() {
  document.body.innerHTML = `
  <label for="input">Input Some Text</label>
  <input type="text" id="input" value="" />
  <div id="hidden" style="display: none;">Hidden</div>
  `;
}

describe("type", () => {
  beforeEach(() => {
    setupInputPage();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should type on the active element", async () => {
    const container = document.body;

    await virtual.start({ container });

    await virtual.next();
    await virtual.next();

    expect(await virtual.itemText()).toEqual("Input Some Text");

    await virtual.type("Hello World!");
    expect(getByRole(container, "textbox")).toHaveValue("Hello World!");
    expect(await virtual.itemText()).toEqual("Input Some Text, Hello World!");

    await virtual.stop();
  });

  it("should handle requests to type on hidden container gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#hidden")! as HTMLElement;

    await virtual.start({ container });

    await virtual.type("Hello World!");

    expect(await virtual.itemTextLog()).toEqual([]);
    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });
});
