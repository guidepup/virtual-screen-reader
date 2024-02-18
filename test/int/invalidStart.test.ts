import {
  ERR_VIRTUAL_MISSING_CONTAINER,
  ERR_VIRTUAL_NOT_STARTED,
} from "../../src/errors.js";
import { virtual } from "../../src/index.js";

describe("Invalid Start", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div>Some Text</div>
    `;
  });

  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should throw if started without a configuration object", async () => {
    await expect(async () => await virtual.start()).rejects.toThrowError(
      ERR_VIRTUAL_MISSING_CONTAINER
    );
  });

  it("should throw if started without a container in the configuration object", async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async () => await virtual.start({} as any)
    ).rejects.toThrowError(ERR_VIRTUAL_MISSING_CONTAINER);
  });

  it("should throw if use a method without starting first", async () => {
    await expect(async () => await virtual.next()).rejects.toThrowError(
      ERR_VIRTUAL_NOT_STARTED
    );
  });
});
