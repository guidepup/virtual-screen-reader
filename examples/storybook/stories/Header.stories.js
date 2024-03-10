import { Header } from "./Header";
import { expect } from "@storybook/test";

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from "../../../lib/esm/index.mjs";

export default {
  title: "Example/Header",
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: "Jane Doe",
    },
  },
  // Add Virtual Screen Reader tests to the play method
  play: async ({ args, canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });

    while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "banner",
      "heading, Acme, level 1",
      "Welcome,",
      args.user.name,
      "!",
      "button, Log out",
      "end of banner",
    ]);

    await virtual.stop();
  },
};

export const LoggedOut = {
  args: {},
  // Add Virtual Screen Reader tests to the play method
  play: async ({ canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });

    while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "banner",
      "heading, Acme, level 1",
      "button, Log in",
      "button, Sign up",
      "end of banner",
    ]);

    await virtual.stop();
  },
};
