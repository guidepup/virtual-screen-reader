import { setupActionsMenuButton } from "./actionsMenuButton";
import { virtual } from "../..";

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

  it("should convey the referenced element as active - applied to the menu role", async () => {
    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.act();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "button, Actions, has popup menu, 1 control",
      "button, Actions, expanded, has popup menu, 1 control",
      "menu, Actions, orientated vertically, active descendant Action 1",
    ]);

    await virtual.stop();
  });
});
