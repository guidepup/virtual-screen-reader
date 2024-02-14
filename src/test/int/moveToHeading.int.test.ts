import { virtual } from "../..";

describe("Move To Heading", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextHeading", () => {
    describe("when there is a level 1 heading in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1 aria-label="Accessible name">Heading</h1>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next heading", async () => {
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.next();
        await virtual.next();

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Accessible name, level 1`,
          `Heading`,
          `end of heading, Accessible name, level 1`,
        ]);
      });
    });

    describe("when there is no heading in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      })

      it("should gracefully handle being asked to move to the next heading", async () => {
        virtual.perform(virtual.commands.moveToNextHeading);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    })
  });
});
