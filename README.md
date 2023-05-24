<h1 align="center">Guidepup Virtual Screen Reader</h1>
<p align="center">
  <i>Virtual screen reader driver for unit test automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/virtual-screen-reader"><img alt="Guidepup Virtual Screen Reader available on NPM" src="https://img.shields.io/npm/v/@guidepup/virtual-screen-reader" /></a>
  <a href="https://www.npmjs.com/package/@guidepup/virtual-screen-reader"><img alt="Guidepup Virtual Screen Reader available on NPM" src="https://img.shields.io/npm/dt/@guidepup/virtual-screen-reader"></a>
  <a href="https://github.com/guidepup/virtual-screen-reader/actions/workflows/test.yml"><img alt="Guidepup Virtual Screen Reader test workflows" src="https://github.com/guidepup/virtual-screen-reader/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/virtual-screen-reader/blob/main/LICENSE"><img alt="Guidepup Virtual Screen Reader uses the MIT license" src="https://img.shields.io/github/license/guidepup/virtual-screen-reader" /></a>
</p>
<p align="center">
  Reliable unit testing for your screen reader a11y workflows through JavaScript.
</p>

## Intro

A11y static analysis tools [only cover 25% of WCAG](https://karlgroves.com/web-accessibility-testing-what-can-be-tested-and-how/) and don't assure on the quality of the user experience for screen reader users. This means teams need to perform lots of manual tests with multiple screen readers to ensure great UX which can take a lot of time... **not anymore!**

With Guidepup Virtual Screen Reader you can automate your screen reader unit test workflows the same you as would for mouse or keyboard based scenarios, no sweat!

## Upcoming Features

🚧🚧🚧 **WIP** 🚧🚧🚧

This project is currently a work in progress, but here are some of the features you can expect from this package as it matures:

- **Full Control** - if a screen reader has a keyboard command, then the Guidepup Virtual Screen Reader supports it.
- **Mirrors Real User Experience** - assert on what users really do and hear when using screen readers.
- **Framework Agnostic** - run with Jest, with Playwright, as an independent script, no vendor lock-in.
- **Fast Feedback** - avoid the cumbersome overhead of running an e2e test with a running screen reader by running virtually over provided DOM.

## Getting Started

Install Guidepup to your project:

```bash
npm install --save-dev @guidepup/virtual-screen-reader
```

And get cracking with your first screen reader unit test automation code!

```ts
import { virtual } from "@guidepup/virtual-screen-reader";

function setupBasicPage() {
  document.body.innerHTML = `
  <nav>Nav Text</nav>
  <section>
    <h1>Section Heading 1</h1>
    <p>Section Text</p>
    <article>
      <header>
        <h1>Article Header Heading 1</h1>
        <p>Article Header Text</p>
      </header>
      <p>Article Text</p>
    </article> 
  </section>
  <footer>Footer</footer>
  `;
}

describe("Screen Reader Tests", () => {
  test("should traverse the page announcing the expected roles and content", () => {
    // Setup a page using a framework and testing library of your choice
    setupBasicPage();

    // Start your virtual screen reader instance
    await virtual.start({ container: document.body });

    // Navigate your environment with the virtual screen reader just as your users would
    while ((await virtual.lastSpokenPhrase()) !== "end of contentinfo") {
      await virtual.next();
    }

    // Assert on what your users would really see and hear when using screen readers
    expect(await virtual.spokenPhraseLog()).toEqual([
      "navigation",
      "Nav Text",
      "end of navigation",
      "region",
      "heading, Section Heading 1",
      "Section Text",
      "article",
      "banner",
      "heading, Article Header Heading 1",
      "Article Header Text",
      "end of banner",
      "Article Text",
      "end of article",
      "end of region",
      "contentinfo",
      "Footer",
      "end of contentinfo",
    ]);

    // Stop your virtual screen reader instance
    await voiceOver.stop();
  });
});
```

## See Also

Check out some of the other Guidepup modules:

- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup/) - reliable automation for your screen reader a11y workflows through JavaScript supporting VoiceOver and NVDA.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - seemless integration of Guidepup with Playwright.

## Similar

Here are some similar unaffiliated projects:

- [`@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/intro)

## License

[MIT](https://github.com/guidepup/guidepup/blob/main/LICENSE)
