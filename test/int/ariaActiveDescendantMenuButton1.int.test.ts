import { setupActionsMenuButton } from "./actionsMenuButton.js";
import { virtual } from "../../src/index.js";

describe("Aria Active Descendant Menu Button", () => {
  let teardown: () => void;

  beforeEach(() => {
    teardown = setupActionsMenuButton();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
    teardown();
  });

  it("should convey the referenced element as active - applied to the menu role", async () => {
    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.act();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Actions, 1 control, has popup menu",
      "button, Actions, 1 control, expanded, has popup menu",
      "menu, Actions, orientated vertically, active descendant Action 1",
    ]);

    await virtual.stop();
  });
});
