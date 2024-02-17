import { virtual } from '../../src/index.js';

const headingLevels = ["1", "2", "3", "4", "5", "6"];

describe("Move To Heading", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextHeading", () => {
    describe("when there are headings in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1>Heading Level 1</h1>
          <h2>Heading Level 2</h2>
          <h3>Heading Level 3</h3>
          <h4>Heading Level 4</h4>
          <h5>Heading Level 5</h5>
          <h6>Heading Level 6</h6>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next heading", async () => {
        while (!(await virtual.lastSpokenPhrase()).includes("level 6")) {
          await virtual.perform(virtual.commands.moveToNextHeading);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading Level 1, level 1`,
          `heading, Heading Level 2, level 2`,
          `heading, Heading Level 3, level 3`,
          `heading, Heading Level 4, level 4`,
          `heading, Heading Level 5, level 5`,
          `heading, Heading Level 6, level 6`,
        ]);
      });
    });

    /**
     * REF: https://a11ysupport.io/tests/tech__aria__headings-above-6
     */
    describe("when there are elements with role heading and aria-level in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <div role="heading" aria-level="1">Heading Level 1</div>
          <div role="heading" aria-level="2">Heading Level 2</div>
          <div role="heading" aria-level="3">Heading Level 3</div>
          <div role="heading" aria-level="4">Heading Level 4</div>
          <div role="heading" aria-level="5">Heading Level 5</div>
          <div role="heading" aria-level="6">Heading Level 6</div>
          <div role="heading" aria-level="7">Heading Level 7</div>
          <div role="heading" aria-level="8">Heading Level 8</div>
          <div role="heading" aria-level="9">Heading Level 9</div>
          <div role="heading" aria-level="10">Heading Level 10</div>
          <div role="heading" aria-level="11">Heading Level 11</div>
          <div role="heading" aria-level="12">Heading Level 12</div>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next heading", async () => {
        while (!(await virtual.lastSpokenPhrase()).includes("level 12")) {
          await virtual.perform(virtual.commands.moveToNextHeading);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading Level 1, level 1`,
          `heading, Heading Level 2, level 2`,
          `heading, Heading Level 3, level 3`,
          `heading, Heading Level 4, level 4`,
          `heading, Heading Level 5, level 5`,
          `heading, Heading Level 6, level 6`,
          `heading, Heading Level 7, level 7`,
          `heading, Heading Level 8, level 8`,
          `heading, Heading Level 9, level 9`,
          `heading, Heading Level 10, level 10`,
          `heading, Heading Level 11, level 11`,
          `heading, Heading Level 12, level 12`,
        ]);
      });
    });

    describe("when there is no heading in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it("should gracefully handle being asked to move to the next heading", async () => {
        virtual.perform(virtual.commands.moveToNextHeading);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    });
  });

  describe("moveToPreviousHeading", () => {
    describe("when there are headings in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <h1>Heading Level 1</h1>
          <h2>Heading Level 2</h2>
          <h3>Heading Level 3</h3>
          <h4>Heading Level 4</h4>
          <h5>Heading Level 5</h5>
          <h6>Heading Level 6</h6>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the previous heading", async () => {
        while (
          !(await virtual.lastSpokenPhrase()).includes("Level 1, level 1")
        ) {
          await virtual.perform(virtual.commands.moveToPreviousHeading);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading Level 6, level 6`,
          `heading, Heading Level 5, level 5`,
          `heading, Heading Level 4, level 4`,
          `heading, Heading Level 3, level 3`,
          `heading, Heading Level 2, level 2`,
          `heading, Heading Level 1, level 1`,
        ]);
      });
    });

    /**
     * REF: https://a11ysupport.io/tests/tech__aria__headings-above-6
     */
    describe("when there are elements with role heading and aria-level in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <div role="heading" aria-level="1">Heading Level 1</div>
          <div role="heading" aria-level="2">Heading Level 2</div>
          <div role="heading" aria-level="3">Heading Level 3</div>
          <div role="heading" aria-level="4">Heading Level 4</div>
          <div role="heading" aria-level="5">Heading Level 5</div>
          <div role="heading" aria-level="6">Heading Level 6</div>
          <div role="heading" aria-level="7">Heading Level 7</div>
          <div role="heading" aria-level="8">Heading Level 8</div>
          <div role="heading" aria-level="9">Heading Level 9</div>
          <div role="heading" aria-level="10">Heading Level 10</div>
          <div role="heading" aria-level="11">Heading Level 11</div>
          <div role="heading" aria-level="12">Heading Level 12</div>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the previous heading", async () => {
        while (
          !(await virtual.lastSpokenPhrase()).includes("Level 1, level 1")
        ) {
          await virtual.perform(virtual.commands.moveToPreviousHeading);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          `heading, Heading Level 12, level 12`,
          `heading, Heading Level 11, level 11`,
          `heading, Heading Level 10, level 10`,
          `heading, Heading Level 9, level 9`,
          `heading, Heading Level 8, level 8`,
          `heading, Heading Level 7, level 7`,
          `heading, Heading Level 6, level 6`,
          `heading, Heading Level 5, level 5`,
          `heading, Heading Level 4, level 4`,
          `heading, Heading Level 3, level 3`,
          `heading, Heading Level 2, level 2`,
          `heading, Heading Level 1, level 1`,
        ]);
      });
    });

    describe("when there is no heading in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it("should gracefully handle being asked to move to the previous heading", async () => {
        virtual.perform(virtual.commands.moveToPreviousHeading);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    });
  });

  describe("moveToNextHeadingLevelN", () => {
    describe("when there are matching heading levels in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = headingLevels
          .map(
            (headingLevel) => `
            <h${headingLevel}>
              Heading with heading level ${headingLevel} A
            </h${headingLevel}>
            <h${headingLevel}>
              Heading with heading level ${headingLevel} B
            </h${headingLevel}>
          `
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(headingLevels)(
        "should let you navigate to the next level %s heading",
        async (headingLevel) => {
          const command =
            virtual.commands[`moveToNextHeadingLevel${headingLevel}`];
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
      });

      it.each(headingLevels)(
        "should gracefully handle being asked to navigate to the next level %s heading",
        async (headingLevel) => {
          await virtual.perform(
            virtual.commands[`moveToNextHeadingLevel${headingLevel}`]
          );

          expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
        }
      );
    });
  });

  describe("moveToPreviousHeadingLevelN", () => {
    describe("when there are matching heading levels in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = headingLevels
          .map(
            (headingLevel) => `
            <h${headingLevel}>
              Heading with heading level ${headingLevel} A
            </h${headingLevel}>
            <h${headingLevel}>
              Heading with heading level ${headingLevel} B
            </h${headingLevel}>
          `
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(headingLevels)(
        "should let you navigate to the previous level %s heading",
        async (headingLevel) => {
          const command =
            virtual.commands[`moveToPreviousHeadingLevel${headingLevel}`];
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
      });

      it.each(headingLevels)(
        "should gracefully handle being asked to navigate to the previous level %s heading",
        async (headingLevel) => {
          await virtual.perform(
            virtual.commands[`moveToPreviousHeadingLevel${headingLevel}`]
          );

          expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
        }
      );
    });
  });
});
