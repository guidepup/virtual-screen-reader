import { virtual } from "../../src/index.js";

describe("Aria Flow To", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("next", () => {
    it("should let a user navigate to a referenced element", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="content_2 content_3 content_4">apple</div>
      <div id="content_2">banana</div>
      <div id="content_3" aria-flowto="content_1">orange</div>
      <div id="content_4">strawberry</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "3 alternate reading orders, 1 previous alternate reading order",
        "apple",
        "end, 3 alternate reading orders, 1 previous alternate reading order",
        "1 previous alternate reading order",
        "banana",
        "end, 1 previous alternate reading order",
        "1 alternate reading order, 1 previous alternate reading order",
        "3 alternate reading orders, 1 previous alternate reading order",
        "apple",
      ]);

      await virtual.stop();
    });

    it("should let a user navigate to any referenced elements", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="content_2 content_3 content_4">apple</div>
      <div id="content_2">banana</div>
      <div id="content_3" aria-flowto="content_1">orange</div>
      <div id="content_4">strawberry</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );
      await virtual.previous();
      await virtual.previous();
      await virtual.previous();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement,
        { index: 1 }
      );
      await virtual.previous();
      await virtual.previous();
      await virtual.previous();
      await virtual.previous();
      await virtual.previous();
      await virtual.previous();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement,
        { index: 2 }
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "3 alternate reading orders, 1 previous alternate reading order",
        "1 previous alternate reading order",
        "end, 3 alternate reading orders, 1 previous alternate reading order",
        "apple",
        "3 alternate reading orders, 1 previous alternate reading order",
        "1 alternate reading order, 1 previous alternate reading order",
        "end, 1 previous alternate reading order",
        "banana",
        "1 previous alternate reading order",
        "end, 3 alternate reading orders, 1 previous alternate reading order",
        "apple",
        "3 alternate reading orders, 1 previous alternate reading order",
        "1 previous alternate reading order",
        "strawberry",
      ]);

      await virtual.stop();
    });

    it("should let a user navigate to a referenced element from an owned element", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-owns="content_2">apple</div>
      <div id="content_2" aria-flowto="content_3">banana</div>
      <div id="content_3">orange</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.next();
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "apple",
        "1 alternate reading order",
        "banana",
        "1 previous alternate reading order",
        "orange",
      ]);

      await virtual.stop();
    });

    it("should gracefully handle no idRefs", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="">apple</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["document", "apple"]);

      await virtual.stop();
    });

    it("should gracefully handle invalid idRefs", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="invalid">apple</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["document", "apple"]);

      await virtual.stop();
    });

    it("should gracefully handle trying to navigate to a next alternate reading order flow that doesn't exist", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="content_2">apple</div>
      <div id="content_2">banana</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement,
        { index: 2 }
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "1 alternate reading order",
        "apple",
      ]);

      await virtual.stop();
    });

    it("should gracefully handle no attempting to follow next alternate reading order on a non-element node", async () => {
      const container = document.createTextNode("Hello World");

      await virtual.start({ container });
      await virtual.perform(
        virtual.commands.moveToNextAlternateReadingOrderElement
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["Hello World"]);

      await virtual.stop();
    });
  });

  describe("previous", () => {
    it("should let a user navigate to an element that target the current element", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-flowto="content_2 content_3 content_4">apple</div>
      <div id="content_2">banana</div>
      <div id="content_3" aria-flowto="content_1">orange</div>
      <div id="content_4">strawberry</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "3 alternate reading orders, 1 previous alternate reading order",
        "1 alternate reading order, 1 previous alternate reading order",
        "orange",
      ]);

      await virtual.stop();
    });

    it("should let a user navigate to any element that target the current element", async () => {
      document.body.innerHTML = `
      <div id="content_1">apple</div>
      <div id="content_2" aria-flowto="content_1">banana</div>
      <div id="content_3" aria-flowto="content_1">orange</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement,
        { index: 1 }
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "2 previous alternate reading orders",
        "1 alternate reading order",
        "orange",
      ]);

      await virtual.stop();
    });

    it("should let a user navigate to a previous alternate reading order element from an owned element", async () => {
      document.body.innerHTML = `
      <div id="content_1" aria-owns="content_2">apple</div>
      <div id="content_2">banana</div>
      <div id="content_3" aria-flowto="content_2">orange</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "apple",
        "1 previous alternate reading order",
        "1 alternate reading order",
        "orange",
      ]);

      await virtual.stop();
    });

    it("should gracefully handle trying to navigate to a previous alternate reading order flow that doesn't exist", async () => {
      document.body.innerHTML = `
      <div id="content_1">apple</div>
      <div id="content_2" aria-flowto="content_1">banana</div>
      <div id="content_3" aria-flowto="content_1">orange</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement,
        { index: 2 }
      );
      await virtual.next();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "2 previous alternate reading orders",
        "apple",
      ]);

      await virtual.stop();
    });

    it("should gracefully handle no previous alternate reading order", async () => {
      document.body.innerHTML = `
      <div id="content_1">apple</div>
      `;

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["document", "apple"]);

      await virtual.stop();
    });

    it("should gracefully handle no attempting to follow previous alternate reading order on a non-element node", async () => {
      const container = document.createTextNode("Hello World");

      await virtual.start({ container });
      await virtual.perform(
        virtual.commands.moveToPreviousAlternateReadingOrderElement
      );

      expect(await virtual.spokenPhraseLog()).toEqual(["Hello World"]);

      await virtual.stop();
    });
  });
});
