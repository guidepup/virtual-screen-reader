import { getByText, queryByText } from "@testing-library/dom";
import { virtual } from '../../src/index.js';

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

  document.body.addEventListener("contextmenu", () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById("status")!.innerHTML = `Right Clicked`;
  });
}

describe("click", () => {
  beforeEach(() => {
    setupButtonPage();
  });

  it("should click", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.click();

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Clicked 1 Time(s)")).toBeInTheDocument();

    await virtual.previous();

    expect(await virtual.lastSpokenPhrase()).toEqual("Clicked 1 Time(s)");

    await virtual.stop();
  });

  it("should double click", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.click({ clickCount: 2 });

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Clicked 2 Time(s)")).toBeInTheDocument();

    await virtual.previous();

    expect(await virtual.lastSpokenPhrase()).toEqual("Clicked 2 Time(s)");

    await virtual.stop();
  });

  it("should triple click", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.click({ clickCount: 3 });

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Clicked 3 Time(s)")).toBeInTheDocument();

    await virtual.previous();

    expect(await virtual.lastSpokenPhrase()).toEqual("Clicked 3 Time(s)");

    await virtual.stop();
  });

  it("should right click", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.click({ button: "right" });

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Right Clicked")).toBeInTheDocument();

    await virtual.previous();

    expect(await virtual.lastSpokenPhrase()).toEqual("Right Clicked");

    await virtual.stop();
  });

  it("should handle requests to click on hidden container gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.querySelector("#hidden")! as HTMLElement;

    await virtual.start({ container });

    await virtual.click();

    expect(await virtual.itemTextLog()).toEqual([]);
    expect(await virtual.spokenPhraseLog()).toEqual([]);

    await virtual.stop();
  });
});
