import { setupActionsMenuButton } from "./actionsMenuButton.js";
import { virtual } from "../../src/index.js";

describe("Aria Active Descendant Menu Button", () => {
  let teardown;

  beforeEach(() => {
    teardown = setupActionsMenuButton();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
    teardown();
  });

  it("should convey when the referenced element changes - applied to the menu role", async () => {
    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.press("ArrowDown");
    await virtual.press("ArrowDown");
    await virtual.press("ArrowDown");

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Actions, has popup menu, 1 control",
      "menu, Actions, orientated vertically, active descendant Action 1",
      "menu, Actions, orientated vertically, active descendant Action 2",
      "menu, Actions, orientated vertically, active descendant Action 3",
    ]);
  });
});
