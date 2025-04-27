# Virtual Screen Reader

<a href="https://www.npmjs.com/package/@guidepup/virtual-screen-reader"><img alt="Virtual Screen Reader available on NPM" src="https://img.shields.io/npm/v/@guidepup/virtual-screen-reader" /></a>
<a href="https://github.com/guidepup/virtual-screen-reader/actions/workflows/test.yml"><img alt="Virtual Screen Reader test workflows" src="https://github.com/guidepup/virtual-screen-reader/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/virtual-screen-reader/blob/main/LICENSE"><img alt="Virtual Screen Reader uses the MIT license" src="https://img.shields.io/github/license/guidepup/virtual-screen-reader" /></a>

## [Documentation](https://www.guidepup.dev/docs/virtual) | [API Reference](https://www.guidepup.dev/docs/api/class-guidepup-virtual-screen-reader)

Virtual Screen Reader is a screen reader simulator for unit tests.

This package aims to supplement your testing by enabling you to automate a Virtual Screen Reader for unit test workflows the same as you would for mouse or keyboard based scenarios.

> [!IMPORTANT]
> This package should not replace but augment your screen reader testing, there is no substitute for testing with real screen readers and with real users.

If you are looking to automate real screen readers, check out the [`@guidepup/guidepup`](https://github.com/guidepup/guidepup) package.

If you are looking to for quick and easy Jest snapshot testing, check out the [`@guidepup/jest`](https://github.com/guidepup/jest) package.

## Capabilities

- **Mirrors Screen Reader Functionality** - simulate and assert on what users can do when using screen readers.
- **Test Framework Agnostic** - run with Jest, Vitest, Web Test Runner, in Storybook, as an independent script, no vendor lock-in.
- **UI Framework Agnostic** - want to use React, Vue, Solid, Svelte, etc.? All good here! Works with any UI framework, and plays nicely with the [Testing Library](https://testing-library.com/) suite.
- **Fast Feedback** - avoid the cumbersome overhead of running an e2e test with a real screen reader by running virtually over the provided DOM.

## Principles

There is currently no explicit specification for screen readers to adhere to, but there are a number of requirements laid out by specifications to inform screen reader expectations. This library aims to meet these requirements so that it can be as "spec compliant" as possible.

Current W3C specifications used:

- [Accessible Name and Description Computation (ACCNAME) 1.2](https://www.w3.org/TR/accname-1.2/)
- [Core Accessibility API Mappings (CORE-AAM) 1.2](https://www.w3.org/TR/core-aam-1.2/)
- [Digital Publishing Accessibility API Mappings](https://www.w3.org/TR/dpub-aam-1.0/)
- [Digital Publishing WAI-ARIA Module 1.1](https://www.w3.org/TR/dpub-aria-1.1/)
- [Graphics Accessibility API Mappings](https://www.w3.org/TR/graphics-aam-1.0/)
- [WAI-ARIA Graphics Module](https://www.w3.org/TR/graphics-aria-1.0/)
- [HTML Accessibility API Mappings (HTML-AAM) 1.0](https://www.w3.org/TR/html-aam-1.0/)
- [ARIA in HTML (HTML-ARIA)](https://www.w3.org/TR/html-aria/)
- [SVG Accessibility API Mappings](https://www.w3.org/TR/svg-aam-1.0/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)

Extracted requirements from these specifications can be found in [docs/requirements.md](docs/requirements.md). If a requirement is not met, [please raise an issue](https://github.com/guidepup/virtual-screen-reader/issues).

Internal modules responsible for constructing the Virtual Screen Reader accessibility tree are being tested against [Web Platform Tests](https://github.com/web-platform-tests/wpt) for the following specs:

- [accname](https://github.com/web-platform-tests/wpt/tree/master/accname)
- [core-aam](https://github.com/web-platform-tests/wpt/tree/master/core-aam)
- [dpub-aam](https://github.com/web-platform-tests/wpt/tree/master/dpub-aam)
- [graphics-aria](https://github.com/web-platform-tests/wpt/tree/master/graphics-aria)
- [html-aam](https://github.com/web-platform-tests/wpt/tree/master/html-aam)
- [svg-aam](https://github.com/web-platform-tests/wpt/tree/master/svg-aam)
- [wai-aria](https://github.com/web-platform-tests/wpt/tree/master/wai-aria)

The current status of the WPT coverage is:

| Passing Test Suites | Failing Tests | Skipped Tests |
| :-----------------: | :-----------: | :-----------: |
|         396         |      81       |      338      |

The included tests, skipped tests, and expected failures can be found in the [WPT configuration file](./test/wpt-jsdom/to-run.yaml) with reasons as to skips and expected failures. "Tentative" tests are excluded as their behaviour is often not yet confirmed.

In addition to the W3C specifications [a11ysupport.io](https://a11ysupport.io/) has been used as a guide for test cases in the absence of anything formal for screen reader output. In future we hope to adopt test cases laid out by the [ARIA and Assistive Technologies (ARIA-AT) community group](https://github.com/w3c/aria-at).

> [!NOTE]
> This library should not used as a substitute for testing with real screen readers and with real screen reader users, but a means to gain quick coverage and confidence by automating away common scenarios the same as any other unit test.

## Getting Started

Install Virtual Screen Reader to your projects:

```bash
npm install --save-dev @guidepup/virtual-screen-reader
```

```bash
yarn add -D @guidepup/virtual-screen-reader
```

And get cracking with your first screen reader unit test automation code!

## Examples

Head over to the [Guidepup Website](https://www.guidepup.dev/) for guides, real world examples, and complete API documentation with examples.

Some examples can also be found in the [examples section](./examples).

You can also check out this project's own [integration tests](https://github.com/guidepup/virtual-screen-reader/tree/main/src/test) to learn how you could use the Virtual Screen Reader in your projects.

### Basic Navigation

Here is a basic example for navigating through HTML in a Jest test in a Node setup:

```ts
import { virtual } from "@guidepup/virtual-screen-reader";

function setupBasicPage() {
  document.body.innerHTML = `
  <nav>Nav Text</nav>
  <section>
    <h1>Section Heading</h1>
    <p>Section Text</p>
    <article>
      <header>
        <h1>Article Header Heading</h1>
        <p>Article Header Text</p>
      </header>
      <p>Article Text</p>
    </article> 
  </section>
  <footer>Footer</footer>
  `;
}

describe("Screen Reader Tests", () => {
  test("should traverse the page announcing the expected roles and content", async () => {
    // Setup a page using a framework and testing library of your choice
    setupBasicPage();

    // Start your Virtual Screen Reader instance
    await virtual.start({ container: document.body });

    // Navigate your environment with the Virtual Screen Reader similar to how your users would
    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    // Assert on the kind of things your users would see and hear when using screen readers
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "navigation",
      "Nav Text",
      "end of navigation",
      "heading, Section Heading, level 1",
      "paragraph",
      "Section Text",
      "end of paragraph",
      "article",
      "heading, Article Header Heading, level 1",
      "paragraph",
      "Article Header Text",
      "end of paragraph",
      "paragraph",
      "Article Text",
      "end of paragraph",
      "end of article",
      "contentinfo",
      "Footer",
      "end of contentinfo",
      "end of document",
    ]);

    // Stop your Virtual Screen Reader instance
    await virtual.stop();
  });
});
```

### Browser

Virtual Screen Reader also supports ESM environments such as browsers.

Try it out on any website in a browser of your choice by executing the following snippet in DevTools:

```ts
const { virtual } = await import(
  "https://unpkg.com/@guidepup/virtual-screen-reader/lib/esm/index.browser.js"
);

await virtual.start({ container: document.body, displayCursor: true });

await virtual.next();

console.log(await virtual.spokenPhraseLog());

await virtual.stop();
```

### AOM Support

Virtual Screen Reader will feature detect [Accessibility Object Model (AOM)](https://github.com/WICG/aom) support and adopt the browser's computed accessible names and roles when available.

See the [Storybook example](./examples/storybook/) to learn how to opt into this behaviour.

## Powerful Tooling

Check out some of the other Guidepup modules:

- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup) - Reliable automation for your screen reader a11y workflows through JavaScript supporting VoiceOver and NVDA.
- [`@guidepup/setup`](https://github.com/guidepup/setup) - Set up your local or CI environment for screen reader test automation.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright) - Seamless integration of Guidepup with Playwright.
- [`@guidepup/jest`](https://github.com/guidepup/jest) - Jest matchers for reliable unit testing of your screen reader a11y workflows.

## Similar

Here are some similar unaffiliated projects:

- [`@testing-library/dom`](https://github.com/testing-library/dom-testing-library/)
- [`html-aria`](https://github.com/drwpow/html-aria)
- [`aria-query`](https://github.com/A11yance/aria-query)
- [`dom-accessibility-api`](https://github.com/eps1lon/dom-accessibility-api)
- [`aria-at`](https://github.com/w3c/aria-at)

## Resources

- [Documentation](https://www.guidepup.dev/docs/virtual)
- [API Reference](https://www.guidepup.dev/docs/api/class-guidepup-virtual-screen-reader)
- [Contributing](.github/CONTRIBUTING.md)
- [Changelog](https://github.com/guidepup/virtual-screen-reader/releases)
- [MIT License](https://github.com/guidepup/virtual-screen-reader/blob/main/LICENSE)
