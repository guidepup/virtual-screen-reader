import { virtual } from "../..";

const headingLevels = ['1', '2', '3', '4', '5', '6'];

describe("Move To Heading", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextHeading", () => {
    describe("when there are headings in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1>Heading</h1>
          <h2>Heading</h2>
          <h3>Heading</h3>
          <h4>Heading</h4>
          <h5>Heading</h5>
          <h6>Heading</h6>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next heading", async () => {
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.perform(virtual.commands.moveToNextHeading);
        await virtual.perform(virtual.commands.moveToNextHeading);

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading, level 1`,
          `heading, Heading, level 2`,
          `heading, Heading, level 3`,
          `heading, Heading, level 4`,
          `heading, Heading, level 5`,
          `heading, Heading, level 6`,
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
    describe("when there are headings in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1>Heading</h1>
          <h2>Heading</h2>
          <h3>Heading</h3>
          <h4>Heading</h4>
          <h5>Heading</h5>
          <h6>Heading</h6>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the previous heading", async () => {
        await virtual.perform(virtual.commands.moveToPreviousHeading);
        await virtual.perform(virtual.commands.moveToPreviousHeading);
        await virtual.perform(virtual.commands.moveToPreviousHeading);
        await virtual.perform(virtual.commands.moveToPreviousHeading);
        await virtual.perform(virtual.commands.moveToPreviousHeading);
        await virtual.perform(virtual.commands.moveToPreviousHeading);

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading, level 6`,
          `heading, Heading, level 5`,
          `heading, Heading, level 4`,
          `heading, Heading, level 3`,
          `heading, Heading, level 2`,
          `heading, Heading, level 1`,
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
            <h${headingLevel}>
              Heading with heading level ${headingLevel} A
            </h${headingLevel}>
            <h${headingLevel}>
              Heading with heading level ${headingLevel} B
            </h${headingLevel}>
          `)
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(headingLevels)(
        "should let you navigate to the next level %s heading",
        async (headingLevel) => {
          const command = virtual.commands[`moveToNextHeadingLevel${headingLevel}`];
          await virtual.perform(command);
          await virtual.perform(command);

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `heading, Heading with heading level ${headingLevel} A, level ${headingLevel}`,
            `heading, Heading with heading level ${headingLevel} B, level ${headingLevel}`,
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

  describe("moveToPreviousHeadingLevelN", () => {
    describe("when there are matching heading levels in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = headingLevels
          .map((headingLevel) => `
            <h${headingLevel}>
              Heading with heading level ${headingLevel} A
            </h${headingLevel}>
            <h${headingLevel}>
              Heading with heading level ${headingLevel} B
            </h${headingLevel}>
          `)
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(headingLevels)(
        "should let you navigate to the previous level %s heading",
        async (headingLevel) => {
          const command = virtual.commands[`moveToPreviousHeadingLevel${headingLevel}`];
          await virtual.perform(command);
          await virtual.perform(command);

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `heading, Heading with heading level ${headingLevel} B, level ${headingLevel}`,
            `heading, Heading with heading level ${headingLevel} A, level ${headingLevel}`,
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
        "should gracefully handle being asked to navigate to the previous level %s heading",
        async (headingLevel) => {
          await virtual.perform(
            virtual.commands[
              `moveToPreviousHeadingLevel${headingLevel}`
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
