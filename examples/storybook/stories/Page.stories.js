import { Page } from "./Page";
import { within, expect } from "@storybook/test";

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from "../../../lib/esm/index.mjs";

export default {
  title: "Example/Page",
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
};

export const LoggedOut = {
  // Add Virtual Screen Reader tests to the play method
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await virtual.start({ container: canvasElement, displayCursor: true });

    while ((await virtual.lastSpokenPhrase()) !== "end of article") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "article",
      "banner",
      "heading, Acme, level 1",
      "button, Log in",
      "button, Sign up",
      "end of banner",
      "region",
      "heading, Pages in Storybook, level 2",
      "paragraph",
      "We recommend building UIs with a",
      "link, component-driven",
      "process starting with atomic components and ending with pages.",
      "end of paragraph",
      "paragraph",
      "Render pages with mock data. This makes it easy to build and review page states without needing to navigate to them in your app. Here are some handy patterns for managing page data in Storybook:",
      "end of paragraph",
      "list",
      "listitem, level 1, position 1, set size 2",
      'Use a higher-level connected component. Storybook helps you compose such data from the "args" of child component stories',
      "end of listitem, level 1, position 1, set size 2",
      "listitem, level 1, position 2, set size 2",
      "Assemble data in the page component from your services. You can mock these services out using Storybook.",
      "end of listitem, level 1, position 2, set size 2",
      "end of list",
      "paragraph",
      "Get a guided tutorial on component-driven development at",
      "link, Storybook tutorials",
      ". Read more in the",
      "link, docs",
      ".",
      "end of paragraph",
      "Tip",
      "Adjust the width of the canvas with the",
      "Viewports addon in the toolbar",
      "end of region",
      "end of article",
    ]);

    await virtual.stop();
  },
};

export const LoggedIn = {
  // Add Virtual Screen Reader tests to the play method
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole("button", { name: /Log in/i });
    await expect(loginButton).toBeInTheDocument();

    await virtual.start({ container: canvasElement, displayCursor: true });

    while ((await virtual.lastSpokenPhrase()) !== "button, Log in") {
      await virtual.next();
    }

    await virtual.act();

    await expect(loginButton).not.toBeInTheDocument();
    const logoutButton = canvas.getByRole("button", { name: /Log out/i });
    await expect(logoutButton).toBeInTheDocument();

    while ((await virtual.lastSpokenPhrase()) !== "end of article") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "article",
      "banner",
      "heading, Acme, level 1",
      "button, Log in",
      "article",
      "banner",
      "heading, Acme, level 1",
      "Welcome,",
      "Jane Doe",
      "!",
      "button, Log out",
      "end of banner",
      "region",
      "heading, Pages in Storybook, level 2",
      "paragraph",
      "We recommend building UIs with a",
      "link, component-driven",
      "process starting with atomic components and ending with pages.",
      "end of paragraph",
      "paragraph",
      "Render pages with mock data. This makes it easy to build and review page states without needing to navigate to them in your app. Here are some handy patterns for managing page data in Storybook:",
      "end of paragraph",
      "list",
      "listitem, level 1, position 1, set size 2",
      'Use a higher-level connected component. Storybook helps you compose such data from the "args" of child component stories',
      "end of listitem, level 1, position 1, set size 2",
      "listitem, level 1, position 2, set size 2",
      "Assemble data in the page component from your services. You can mock these services out using Storybook.",
      "end of listitem, level 1, position 2, set size 2",
      "end of list",
      "paragraph",
      "Get a guided tutorial on component-driven development at",
      "link, Storybook tutorials",
      ". Read more in the",
      "link, docs",
      ".",
      "end of paragraph",
      "Tip",
      "Adjust the width of the canvas with the",
      "Viewports addon in the toolbar",
      "end of region",
      "end of article",
    ]);

    await virtual.stop();
  },
};
