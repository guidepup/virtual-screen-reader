import { ERR_NOT_IMPLEMENTED } from "../../src/errors";
import { setupBasicPage } from "../utils";
import { virtual } from "../../src";

describe("perform", () => {
  beforeEach(() => {
    setupBasicPage();
  });

  it("should throw a not implemented error", async () => {
    await virtual.start({ container: document.body });

    await expect(async () => await virtual.perform()).rejects.toThrowError(
      ERR_NOT_IMPLEMENTED
    );

    await virtual.stop();
  });
});
