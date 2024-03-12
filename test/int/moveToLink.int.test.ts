import { virtual } from "../../src/index.js";

describe("Move To Link", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextLink", () => {
    describe("when there are links in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
          <a href="/path-1">Link 1</a>
          <a href="/path-2">Link 2</a>
          <a href="/path-3">Link 3</a>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next link", async () => {
        while (!(await virtual.lastSpokenPhrase()).includes("Link 3")) {
          await virtual.perform(virtual.commands.moveToNextLink);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          "link, Link 1",
          "link, Link 2",
          "link, Link 3",
        ]);
      });
    });

    describe("when there is no link in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it("should gracefully handle being asked to move to the next link", async () => {
        virtual.perform(virtual.commands.moveToNextLink);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    });
  });

  describe("moveToPreviousLink", () => {
    describe("when there are links in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = `
        <a href="/path-1">Link 1</a>
        <a href="/path-2">Link 2</a>
        <a href="/path-3">Link 3</a>
        `;

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the previous link", async () => {
        while (!(await virtual.lastSpokenPhrase()).includes("Link 1")) {
          await virtual.perform(virtual.commands.moveToPreviousLink);
        }

        const spokenPhraseLog = await virtual.spokenPhraseLog();
        expect(spokenPhraseLog).toEqual([
          "document",
          "link, Link 3",
          "link, Link 2",
          "link, Link 1",
        ]);
      });
    });

    describe("when there is no link in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it("should gracefully handle being asked to move to the previous link", async () => {
        virtual.perform(virtual.commands.moveToPreviousLink);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    });
  });
});
