/**
 * Replace with:
 *
 * import { virtual } from '@guidepup/virtual-screen-reader/browser.js'
 *
 * in your own code.
 */
import { virtual } from "../../../lib/esm/index.browser.js";

document.body.innerHTML = `<nav>Nav Text</nav>
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
<footer>Footer</footer>`;

await virtual.start({ container: document.body, displayCursor: true });

window.virtual = virtual;
