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
  "search",
];

const quickNavigationRolesWithHeading = [...quickNavigationRoles, "heading"];

const roleAttributesMap = {
  heading: ", level 2",
};

describe("Move To Role", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextRole", () => {
    describe("when there are matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = quickNavigationRolesWithHeading
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeading)(
        "should let you navigate to the next %s",
        async (role) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const command = `moveToNext${role.at(0)!.toUpperCase()}${role.slice(
            1
          )}`;
          const roleAttributes = roleAttributesMap[role] ?? "";

          await virtual.perform(virtual.commands[command]);
          await virtual.next();
          await virtual.next();

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `${role}, Accessible name${roleAttributes}`,
            `Node with role: ${role}`,
            `end of ${role}, Accessible name${roleAttributes}`,
          ]);
        }
      );
    });

    describe("when there are no matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeading)(
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
        document.body.innerHTML = quickNavigationRolesWithHeading
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeading)(
        "should let you navigate to the previous %s",
        async (role) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const command = `moveToPrevious${role
            .at(0)!
            .toUpperCase()}${role.slice(1)}`;
          const roleAttributes = roleAttributesMap[role] ?? "";

          await virtual.perform(virtual.commands[command]);
          await virtual.next();
          await virtual.next();

          expect(await virtual.spokenPhraseLog()).toEqual([
            "document",
            `${role}, Accessible name${roleAttributes}`,
            `Node with role: ${role}`,
            `end of ${role}, Accessible name${roleAttributes}`,
          ]);
        }
      );
    });

    describe("when there are no matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = "";

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeading)(
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
        document.body.innerHTML = quickNavigationRoles
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it("should let you navigate to the next landmark", async () => {
        await Promise.all(
          quickNavigationRoles.flatMap(() => [
            virtual.perform(virtual.commands.moveToNextLandmark),
            virtual.next(),
            virtual.next(),
          ])
        );

        expect(await virtual.spokenPhraseLog()).toEqual([
          "document",
          ...quickNavigationRoles.flatMap((role) => [
            `${role}, Accessible name`,
            `Node with role: ${role}`,
            `end of ${role}, Accessible name`,
          ]),
        ]);
      });

      it("should let you navigate to the previous landmark", async () => {
        await Promise.all(
          quickNavigationRoles.flatMap(() => [
            virtual.perform(virtual.commands.moveToPreviousLandmark),
            virtual.next(),
            virtual.next(),
            virtual.previous(),
            virtual.previous(),
          ])
        );

        expect(await virtual.spokenPhraseLog()).toEqual([
          "document",
          ...quickNavigationRoles
            .slice()
            .reverse()
            .flatMap((role) => [
              `${role}, Accessible name`,
              `Node with role: ${role}`,
              `end of ${role}, Accessible name`,
              `Node with role: ${role}`,
              `${role}, Accessible name`,
            ]),
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
