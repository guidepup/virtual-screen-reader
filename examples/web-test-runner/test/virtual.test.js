import { expect } from "@esm-bundle/chai";

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from "../../../lib/esm/index.js";

beforeEach(async () => {
  document.body.innerHTML = "<h1>Heading</h1><p>Paragraph text</p>";

  await virtual.start({ container: document.body });
});

afterEach(async () => {
  await virtual.stop();

  document.body.innerHTML = "";
});

it("renders a heading and a paragraph", async () => {
  await virtual.next();
  await virtual.next();
  await virtual.next();
  await virtual.next();
  await virtual.next();

  expect(await virtual.spokenPhraseLog()).to.eql([
    "document",
    "heading, Heading, level 1",
    "paragraph",
    "Paragraph text",
    "end of paragraph",
    "end of document",
  ]);
});
