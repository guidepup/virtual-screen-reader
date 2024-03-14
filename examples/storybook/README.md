# Storybook Example

A basic example combining [Storybook](https://storybook.js.org/) and Virtual Screen Reader.

This includes a tests asserting on some basic component stories.

Run this example with:

```bash
cd examples/storybook
npm install
npm run storybook
```

For each story check out the "Interactions" tab to view the Virtual Screen Reader test result.

> [!IMPORTANT]
> This example serves to demonstrate how you can use the Virtual Screen Reader. The components themselves may not be using best accessibility practices.
>
> Always evaluate your own components for accessibility and test with real users.

## Using browser computed accessible role and name

Chrome has a number of [command-line switches](https://www.chromium.org/developers/how-tos/run-chromium-with-flags/) that allow for the enabling of experimental features.

To test this example with the [Accessibility Object Model (AOM)](https://github.com/WICG/aom) enabled you can launch Chrome with the `--enable-experimental-web-platform-features` switch. E.g. for MacOS:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-experimental-web-platform-features http://localhost:6006/?path=/docs/configure-your-project--docs
```

This enables experimental support for exposing the browser's computed accessible name and role for elements.

When enabled Virtual Screen Reader will prefer the computed roles and names over it's own algorithm for generating roles and names. As a result, there may be differences observed in the spoken phrases for elements. Where there are differences, please raise a [GitHub issue](https://github.com/guidepup/virtual-screen-reader/issues).
