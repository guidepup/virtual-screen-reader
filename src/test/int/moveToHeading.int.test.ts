import { virtual } from "../..";

const headingLevels = ['1', '2', '3', '4', '5', '6'];

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

  describe("moveToPreviousHeading", () => {
    describe("when there is a level 1 heading in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1 aria-label="Accessible name">Heading</h1>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the previous heading", async () => {
        await virtual.perform(virtual.commands.moveToPreviousHeading);
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

      it("should gracefully handle being asked to move to the previous heading", async () => {
        virtual.perform(virtual.commands.moveToPreviousHeading);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    })
  });

  describe("moveToNextHeadingLevelN", () => {
    describe("when there are matching heading levels in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = headingLevels
          .map((headingLevel) => `
            <h${headingLevel} aria-label="Accessible name">
              Heading with heading level: ${headingLevel}
            </h${headingLevel}>
          `)
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(headingLevels)(
        "should let you navigate to the next level %s heading",
        async (headingLevel) => {
          await virtual.perform(
            virtual.commands[
              `moveToNextHeadingLevel${headingLevel}`
            ]
          );
          await virtual.next();
          await virtual.next();

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `heading, Accessible name, level ${headingLevel}`,
            `Heading with heading level: ${headingLevel}`,
            `end of heading, Accessible name, level ${headingLevel}`,
          ]);
        }
      );
    });

    describe("when there are no matching heading levels in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      })

      it.each(headingLevels)(
        "should gracefully handle being asked to navigate to the next level %s heading",
        async (headingLevel) => {
          await virtual.perform(
            virtual.commands[
              `moveToNextHeadingLevel${headingLevel}`
            ]
          );

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
          ]);
        }
      )
    })
  });
});
