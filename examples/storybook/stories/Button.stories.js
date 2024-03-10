import { Button } from "./Button";
import { expect } from "@storybook/test";

/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader'
 *
 * in your own code.
 */
import { virtual } from "../../../lib/esm/index.mjs";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Example/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: "Primary Button",
  },
  // Add Virtual Screen Reader tests to the play method
  play: async ({ args, canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });
    expect(await virtual.spokenPhraseLog()).toEqual([`button, ${args.label}`]);
    await virtual.stop();
  },
};

export const Secondary = {
  args: {
    label: "Secondary Button",
  },
  // Add Virtual Screen Reader tests to the play method
  play: async ({ args, canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });
    expect(await virtual.spokenPhraseLog()).toEqual([`button, ${args.label}`]);
    await virtual.stop();
  },
};

export const Large = {
  args: {
    size: "large",
    label: "Large Button",
  },
  // Add Virtual Screen Reader tests to the play method
  play: async ({ args, canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });
    expect(await virtual.spokenPhraseLog()).toEqual([`button, ${args.label}`]);
    await virtual.stop();
  },
};

export const Small = {
  args: {
    size: "small",
    label: "Small Button",
  },
  // Add Virtual Screen Reader tests to the play method
  play: async ({ args, canvasElement }) => {
    await virtual.start({ container: canvasElement, displayCursor: true });
    expect(await virtual.spokenPhraseLog()).toEqual([`button, ${args.label}`]);
    await virtual.stop();
  },
};
