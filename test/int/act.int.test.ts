import { getByText, queryByText } from "@testing-library/dom";
import { virtual } from "../../src";

function setupButtonPage() {
  document.body.innerHTML = `
  <p id="status">Not Clicked</p>
  <div id="hidden" style="display: none;">Hidden</div>
  `;

  const button = document.createElement("button");

  button.addEventListener("click", function (event) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById(
      "status"
    )!.innerHTML = `Clicked ${event.detail} Time(s)`;
  });

  button.innerHTML = "Click Me";

  document.body.appendChild(button);
}

describe("act", () => {
  beforeEach(() => {
    setupButtonPage();
  });

  it("should perform the default action", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.act();

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Clicked 1 Time(s)")).toBeInTheDocument();

    await virtual.previous();

    expect(await virtual.lastSpokenPhrase()).toEqual("Clicked 1 Time(s)");

    await virtual.stop();
  });

  it("should handle requests to perform the default action on hidden container gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#hidden")! as HTMLElement;

    await virtual.start({ container });

    await virtual.act();

    expect(await virtual.itemTextLog()).toEqual([]);
    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });
});
