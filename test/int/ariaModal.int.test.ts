/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from "@testing-library/dom";
import { setupAriaModal } from "./ariaModal.js";
import { virtual } from "../../src/index.js";

/**
 * REF:
 * - https://www.w3.org/TR/wai-aria-1.2/#aria-modal
 * - https://a11ysupport.io/tech/aria/aria-modal_attribute
 */
describe("Aria Modal", () => {
  let teardown;

  describe("when the dialog is modal", () => {
    beforeEach(async () => {
      teardown = setupAriaModal("true");

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.next();
      await virtual.act();
    });

    afterEach(async () => {
      await virtual.stop();
      teardown();
    });

    it('should convey the presence of aria-modal="true" - applied to the dialog role', async () => {
      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "heading, Non-modal heading, level 1",
        "button, Add Delivery Address",
        "dialog, Add Delivery Address, modal",
        "textbox, Street:",
      ]);
    });

    it('should limit reading of children of aria-modal="true" - applied to the dialog role - moving to the next item', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      while ((await virtual.lastSpokenPhrase()) !== "textbox, Street:") {
        await virtual.next();
      }

      expect(await virtual.spokenPhraseLog()).toEqual([
        "City:",
        "textbox, City:",
        "State:",
        "textbox, State:",
        "Zip:",
        "textbox, Zip:",
        "Special instructions:",
        "textbox, Special instructions:, For example, gate code or other information to help the driver find you",
        "For example, gate code or other information to help the driver find you",
        "button, Verify Address",
        "button, Add",
        "button, Cancel",
        "heading, Add Delivery Address, level 2",
        "Street:",
        "textbox, Street:",
      ]);
    });

    it('should limit reading of children of aria-modal="true" - applied to the dialog role - moving to the previous item', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      while ((await virtual.lastSpokenPhrase()) !== "textbox, Street:") {
        await virtual.previous();
      }

      expect(await virtual.spokenPhraseLog()).toEqual([
        "Street:",
        "heading, Add Delivery Address, level 2",
        "button, Cancel",
        "button, Add",
        "button, Verify Address",
        "For example, gate code or other information to help the driver find you",
        "textbox, Special instructions:, For example, gate code or other information to help the driver find you",
        "Special instructions:",
        "textbox, Zip:",
        "Zip:",
        "textbox, State:",
        "State:",
        "textbox, City:",
        "City:",
        "textbox, Street:",
      ]);
    });

    it('should remove outside content from navigational shortcuts when aria-modal="true" - applied to the dialog role - move to next heading', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      await virtual.perform(virtual.commands.moveToNextHeading);
      await virtual.perform(virtual.commands.moveToNextHeading);

      expect(await virtual.spokenPhraseLog()).toEqual([
        "heading, Add Delivery Address, level 2",
        "heading, Add Delivery Address, level 2",
      ]);
    });

    it('should remove outside content from navigational shortcuts when aria-modal="true" - applied to the dialog role - move to previous heading', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      await virtual.perform(virtual.commands.moveToPreviousHeading);
      await virtual.perform(virtual.commands.moveToPreviousHeading);

      expect(await virtual.spokenPhraseLog()).toEqual([
        "heading, Add Delivery Address, level 2",
        "heading, Add Delivery Address, level 2",
      ]);
    });

    it('should remove outside content from navigational shortcuts when aria-modal="true" - applied to the dialog role - move to next heading level 1', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      await virtual.perform(virtual.commands.moveToNextHeadingLevel1);

      expect(await virtual.spokenPhraseLog()).toEqual([]);
    });

    it('should remove outside content from navigational shortcuts when aria-modal="true" - applied to the dialog role - move to previous heading level 1', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      await virtual.perform(virtual.commands.moveToPreviousHeadingLevel1);

      expect(await virtual.spokenPhraseLog()).toEqual([]);
    });

    it("should not limit navigation to the modal element when focus moves to an element outside the modal element", async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      // Make sure the APG example "focusTrap" doesn't try to keep focus within
      // the modal and complicate the focus shift.
      (window as any).aria.Utils.IgnoreUtilFocusChanges = true;

      // Move the focus back to the button on the main page.
      screen.getByRole("button", { name: "Add Delivery Address" }).focus();

      // Reset the APG example "focusTrap".
      (window as any).aria.Utils.IgnoreUtilFocusChanges = false;

      await virtual.previous();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "button, Add Delivery Address",
        "heading, Non-modal heading, level 1",
      ]);
    });
  });

  describe("when the dialog is not modal", () => {
    beforeEach(async () => {
      teardown = setupAriaModal("false");

      await virtual.start({ container: document.body });
      await virtual.next();
      await virtual.next();
      await virtual.act();
    });

    afterEach(async () => {
      await virtual.stop();
      teardown();
    });

    it('should convey the presence of aria-modal="false" - applied to the dialog role', async () => {
      expect(await virtual.spokenPhraseLog()).toEqual([
        "document",
        "heading, Non-modal heading, level 1",
        "button, Add Delivery Address",
        "dialog, Add Delivery Address, not modal",
        "textbox, Street:",
      ]);
    });

    it('should not limit reading of children of aria-modal="false" - applied to the dialog role - moving to the previous item', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      while ((await virtual.lastSpokenPhrase()) !== "document") {
        // Make sure the APG example "focusTrap" doesn't try to keep focus
        // within the modal so we can assert the virtual cursor would escape
        // the modal.
        (window as any).aria.Utils.IgnoreUtilFocusChanges = true;

        await virtual.previous();

        // Reset the APG example "focusTrap".
        (window as any).aria.Utils.IgnoreUtilFocusChanges = false;
      }

      expect(await virtual.spokenPhraseLog()).toEqual([
        "Street:",
        "heading, Add Delivery Address, level 2",
        "dialog, Add Delivery Address, not modal",
        "button, Add Delivery Address",
        "heading, Non-modal heading, level 1",
        "document",
      ]);
    });

    it('should not remove outside content from navigational shortcuts when aria-modal="false" - applied to the dialog role - move to previous heading', async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      await virtual.perform(virtual.commands.moveToPreviousHeading);

      // Make sure the APG example "focusTrap" doesn't try to keep focus
      // within the modal so we can assert the virtual cursor would escape
      // the modal.
      (window as any).aria.Utils.IgnoreUtilFocusChanges = true;

      await virtual.perform(virtual.commands.moveToPreviousHeading);

      // Reset the APG example "focusTrap".
      (window as any).aria.Utils.IgnoreUtilFocusChanges = false;

      expect(await virtual.spokenPhraseLog()).toEqual([
        "heading, Add Delivery Address, level 2",
        "heading, Non-modal heading, level 1",
      ]);
    });

    it("should not limit navigation to the modal element when focus moves to an element outside the modal element", async () => {
      await virtual.clearItemTextLog();
      await virtual.clearSpokenPhraseLog();

      // Make sure the APG example "focusTrap" doesn't try to keep focus within
      // the modal and complicate the focus shift.
      (window as any).aria.Utils.IgnoreUtilFocusChanges = true;

      // Move the focus back to the button on the main page.
      screen.getByRole("button", { name: "Add Delivery Address" }).focus();

      // Reset the APG example "focusTrap".
      (window as any).aria.Utils.IgnoreUtilFocusChanges = false;

      await virtual.previous();

      expect(await virtual.spokenPhraseLog()).toEqual([
        "button, Add Delivery Address",
        "heading, Non-modal heading, level 1",
      ]);
    });
  });
});
