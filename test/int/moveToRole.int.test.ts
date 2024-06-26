import { virtual } from "../../src/index.js";

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

const quickNavigationRolesWithHeadingAndLink = [
  ...quickNavigationRoles,
  "heading",
  "link",
];

const roleAttributesMap: Record<string, string> = {
  heading: ", level 2",
};

type VirtualCommand = keyof typeof virtual.commands;

describe("Move To Role", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  describe("moveToNextRole", () => {
    describe("when there are matching roles in the container", () => {
      beforeEach(async () => {
        document.body.innerHTML = quickNavigationRolesWithHeadingAndLink
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeadingAndLink)(
        "should let you navigate to the next %s",
        async (role) => {
           
          const command = `moveToNext${role.at(0)!.toUpperCase()}${role.slice(
            1
          )}` as VirtualCommand;
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

      it.each(quickNavigationRolesWithHeadingAndLink)(
        "should gracefully handle being asked to move to the next %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
               
              `moveToNext${role.at(0)!.toUpperCase()}${role.slice(
                1
              )}` as VirtualCommand
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
        document.body.innerHTML = quickNavigationRolesWithHeadingAndLink
          .map(
            (role) =>
              `<div role="${role}" aria-label="Accessible name">Node with role: ${role}</div>`
          )
          .join("");

        await virtual.start({ container: document.body });
      });

      it.each(quickNavigationRolesWithHeadingAndLink)(
        "should let you navigate to the previous %s",
        async (role) => {
           
          const command = `moveToPrevious${role
            .at(0)!
            .toUpperCase()}${role.slice(1)}` as VirtualCommand;
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

      it.each(quickNavigationRolesWithHeadingAndLink)(
        "should gracefully handle being asked to move to the previous %s",
        async (role) => {
          await virtual.perform(
            virtual.commands[
               
              `moveToPrevious${role.at(0)!.toUpperCase()}${role.slice(
                1
              )}` as VirtualCommand
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
