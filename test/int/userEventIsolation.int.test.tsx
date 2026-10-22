import { act, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { virtual } from "../../src/index.js";

/**
 * Consumers commonly end up with their own copy of `@testing-library/user-event`
 * (e.g. bundled by Storybook) alongside the one used by the Virtual Screen
 * Reader. Load a separate module instance to simulate this.
 */
function loadSeparateUserEvent(): typeof import("@testing-library/user-event") {
  let separateUserEvent: typeof import("@testing-library/user-event");

  jest.isolateModules(() => {
    separateUserEvent = jest.requireActual("@testing-library/user-event");
  });

  return separateUserEvent!;
}

/**
 * The separate copy is not configured by `@testing-library/react`, so its
 * interactions are wrapped in `act()` explicitly.
 */
const { userEvent: separateUserEvent } = loadSeparateUserEvent();

function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <>
      <label htmlFor="fruit">Choose a fruit</label>
      <input
        id="fruit"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p>Current value: {value || "empty"}</p>
    </>
  );
}

describe("userEvent isolation", () => {
  afterEach(async () => {
    await virtual.stop();
  });

  it("should not interfere with a separate userEvent session when only navigating", async () => {
    const user = separateUserEvent.setup();

    render(<ControlledInput />);

    const input = screen.getByLabelText("Choose a fruit");

    await act(() => user.type(input, "lu"));

    expect(input).toHaveValue("lu");
    expect(screen.getByText("Current value: lu")).toBeInTheDocument();

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    await virtual.stop();

    await act(() => user.clear(input));

    expect(input).toHaveValue("");
    expect(screen.getByText("Current value: empty")).toBeInTheDocument();
  });
});
