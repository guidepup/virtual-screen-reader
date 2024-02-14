import { virtual } from "../..";

const quickNavigationRoles = [
  "banner",
  "complementary",
  "contentinfo",
  "figure",
  "form",
  "main",
  "navigation",
  "region",
  // Headings are tested separately because headings must have a heading level
  // "heading",
  "search",
];

const quickNavigationRolesWithLandmark = [...quickNavigationRoles, "landmark"];

describe("Move To Role", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextRole", () => {
    describe("when there are matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = quickNavigationRoles
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRoles)(
        "should let you navigate to the next %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `moveToNext${role.at(0)!.toUpperCase()}${role.slice(1)}`
            ]
          );
          await virtual.next();
          await virtual.next();

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `${role}, Accessible name`,
            `Node with role: ${role}`,
            `end of ${role}, Accessible name`,
          ]);
        }
      );
    });

    describe("when there are no matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRoles)(
        "should gracefully handle being asked to move to the next %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `moveToNext${role.at(0)!.toUpperCase()}${role.slice(1)}`
            ]
          );

          expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
        }
      );
    });
  });

  describe("moveToPreviousRole", () => {
    describe("when there are matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = quickNavigationRoles
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRoles)(
        "should let you navigate to the previous %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `moveToPrevious${role.at(0)!.toUpperCase()}${role.slice(1)}`
            ]
          );
          await virtual.next();
          await virtual.next();

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `${role}, Accessible name`,
            `Node with role: ${role}`,
            `end of ${role}, Accessible name`,
          ]);
        }
      );
    });

    describe("when there are no matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRoles)(
        "should gracefully handle being asked to move to the previous %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `moveToPrevious${role.at(0)!.toUpperCase()}${role.slice(1)}`
            ]
          );

          expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
        }
      );
    });
  });

  describe("landmark", () => {
    describe("when there are matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = quickNavigationRolesWithLandmark
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next landmark", async () => {
        await Promise.all(
          quickNavigationRoles.map(() =>
            virtual.perform(virtual.commands.moveToNextLandmark)
          )
        );

        expect(await virtual.spokenPhraseLog()).toEqual([
          "document",
          ...quickNavigationRoles.map((role) => `${role}, Accessible name`),
        ]);
      });

      it("should let you navigate to the previous landmark", async () => {
        await Promise.all(
          quickNavigationRoles.map(() =>
            virtual.perform(virtual.commands.moveToPreviousLandmark)
          )
        );

        expect(await virtual.spokenPhraseLog()).toEqual([
          "document",
          ...quickNavigationRoles
            .slice()
            .reverse()
            .map((role) => `${role}, Accessible name`),
        ]);
      });
    });

    describe("when there are no matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it("should gracefully handle being asked to move to the next landmark", async () => {
        await virtual.perform(virtual.commands.moveToNextLandmark);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });

      it("should gracefully handle being asked to move to the previous landmark", async () => {
        await virtual.perform(virtual.commands.moveToPreviousLandmark);

        expect(await virtual.spokenPhraseLog()).toEqual(["document"]);
      });
    });
  });
});
