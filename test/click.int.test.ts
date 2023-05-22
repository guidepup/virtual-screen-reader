import { getByText, queryByText } from "@testing-library/dom";
import { setupButtonPage } from "./utils";
import { virtual } from "../src";

describe("click", () => {
  beforeEach(() => {
    setupButtonPage();
  });

  it("should click", async () => {
    const container = document.body;

    await virtual.start({ container });

    expect(getByText(container, "Not Clicked")).toBeInTheDocument();
    expect(queryByText(container, "Clicked")).not.toBeInTheDocument();

    while ((await virtual.itemText()) !== "Click Me") {
      await virtual.next();
    }

    await virtual.click();

    expect(queryByText(container, "Not Clicked")).not.toBeInTheDocument();
    expect(getByText(container, "Clicked")).toBeInTheDocument();

    await virtual.stop();
  });
});
