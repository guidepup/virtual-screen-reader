import { setupBasicPage } from "../utils.js";
import { virtual } from "../../src/index.js";

describe("Active Node", () => {
  beforeEach(() => {
    setupBasicPage();
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should allow consumers to get the active node under the screen reader cursor", async () => {
    await virtual.start({ container: document.body });

    expect(virtual.activeNode).toBe(document.body);

    await virtual.next();

    expect(virtual.activeNode).toBe(document.getElementsByTagName("nav")[0]);

    await virtual.next();

    expect(virtual.activeNode).toBe(
      document.getElementsByTagName("nav")[0].firstChild
    );

    await virtual.next();

    expect(virtual.activeNode).toBe(document.getElementsByTagName("nav")[0]);

    await virtual.next();

    expect(virtual.activeNode).toBe(
      document.getElementsByTagName("section")[0]
    );
  });
});
