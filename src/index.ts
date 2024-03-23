import { StartOptions, Virtual } from "./Virtual";

/**
 * [API Reference](https://www.guidepup.dev/docs/api/class-virtual)
 *
 * A Virtual Screen Reader instance that can be used to launch and control a
 * headless JavaScript screen reader which is compatible with any specification
 * compliant DOM implementation, e.g. jsdom, Jest, or any modern browser.
 *
 * Here's a typical example:
 *
 * ```ts
 * import { virtual } from "@guidepup/virtual-screen-reader";
 *
 * function setupBasicPage() {
 *   document.body.innerHTML = `
 *   <nav>Nav Text</nav>
 *   <section>
 *     <h1>Section Heading</h1>
 *     <p>Section Text</p>
 *     <article>
 *       <header>
 *         <h1>Article Header Heading</h1>
 *         <p>Article Header Text</p>
 *       </header>
 *       <p>Article Text</p>
 *     </article>
 *   </section>
 *   <footer>Footer</footer>
 *   `;
 * }
 *
 * describe("Screen Reader Tests", () => {
 *   test("should traverse the page announcing the expected roles and content", async () => {
 *     // Setup a page using a framework and testing library of your choice
 *     setupBasicPage();
 *
 *     // Start your Virtual Screen Reader instance
 *     await virtual.start({ container: document.body });
 *
 *     // Navigate your environment with the Virtual Screen Reader just as your users would
 *     while ((await virtual.lastSpokenPhrase()) !== "end of document") {
 *       await virtual.next();
 *     }
 *
 *     // Assert on what your users would really see and hear when using screen readers
 *     expect(await virtual.spokenPhraseLog()).toEqual([
 *       "document",
 *       "navigation",
 *       "Nav Text",
 *       "end of navigation",
 *       "region",
 *       "heading, Section Heading, level 1",
 *       "Section Text",
 *       "article",
 *       "banner",
 *       "heading, Article Header Heading, level 1",
 *       "Article Header Text",
 *       "end of banner",
 *       "Article Text",
 *       "end of article",
 *       "end of region",
 *       "contentinfo",
 *       "Footer",
 *       "end of contentinfo",
 *       "end of document",
 *     ]);
 *
 *     // Stop your Virtual Screen Reader instance
 *     await virtual.stop();
 *   });
 * });
 * ```
 */
export const virtual = new Virtual();

export { StartOptions, Virtual };
