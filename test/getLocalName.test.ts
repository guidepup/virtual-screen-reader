import { getLocalName } from "../src/getLocalName.js";

describe("getLocalName", () => {
  describe("when the localName property is supported", () => {
    test("should return the localName", () => {
      const localName = "test-local-name";

      expect(getLocalName({ localName } as Element)).toBe(localName);
    });
  });

  describe("when the localName property is not supported", () => {
    test("should fallback to the tagname lowercased", () => {
      const tagName = "test-tag-name";

      expect(getLocalName({ tagName: tagName.toUpperCase() } as Element)).toBe(
        tagName
      );
    });
  });
});
