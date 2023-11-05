import { virtual } from "../..";

describe("Detection", () => {
  it("should return true for Virtual being a supported screen reader for the OS", async () => {
    expect(await virtual.detect()).toBeTruthy();
  });

  it("should return false for Virtual being the default screen reader for the OS", async () => {
    expect(await virtual.default()).toBeFalsy();
  });
});
