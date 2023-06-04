import { virtual } from "../../../src";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/html-aam/roles.html
 */

describe("HTML-AAM Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <!-- Most test names correspond to unique ID defined in the https://w3c.github.io/html-aam/ spec. -->

    <a href="#" data-testname="el-a" data-expectedrole="link" class="ex">x</a>
    <a data-testname="el-a-no-href" data-expectedrole="generic" class="ex">x</a>
    <!-- todo: abbr -->
    <address data-testname="el-address" data-expectedrole="group" class="ex">x</address>
    <!-- area -> ./fragile/area-role.html -->
    <article data-testname="el-article" data-expectedrole="article" class="ex">x</article>

    <!-- el-aside -->
    <nav>
      <aside data-testname="el-aside-in-section-with-name" data-expectedrole="complementary" aria-label="x" class="ex">x</aside>
      <aside data-testname="el-aside-in-section-without-name" data-expectedrole="generic" class="ex">x</aside>
    </nav>
    <aside data-testname="el-aside-ancestorbodymain" data-expectedrole="complementary" class="ex">x</aside>

    <!-- todo: audio -->
    <!-- todo: autonomous custom element -->
    <b data-testname="el-b" data-expectedrole="generic" class="ex">x</b>
    <!-- base (not mapped) -->
    <bdi data-testname="el-bdi" data-expectedrole="generic" class="ex">x</bdi>
    <bdo data-testname="el-bdo" data-expectedrole="generic" class="ex">x</bdo>
    <blockquote data-testname="el-blockquote" data-expectedrole="blockquote" class="ex">x</blockquote>
    <!-- todo: body -->
    <!-- br (not mapped) -->
    <button data-testname="el-button" data-expectedrole="button" class="ex">x</button>
    <!-- todo: canvas -->
    <!-- caption -> ./table-roles.html -->
    <!-- todo: cite -->
    <code data-testname="el-code" data-expectedrole="code" class="ex">x</code>
    <!-- todo: col -->
    <!-- todo: colgroup -->
    <data value="1" data-testname="el-data" data-expectedrole="generic" class="ex">x</data>
    <!-- todo: datalist -->

    <!-- el-dd -->
    <dl>
      <dt>x</dt>
      <dd data-testname="el-dd" data-expectedrole="definition" class="ex">x</dd>
    </dl>

    <del data-testname="el-del" data-expectedrole="deletion" class="ex">x</del>
    <details data-testname="el-details" data-expectedrole="group" class="ex"><summary>x</summary>x</details>
    <dfn data-testname="el-dfn" data-expectedrole="term" class="ex">x</dfn>
    <div open data-testname="el-div" data-expectedrole="generic" class="ex">x</div>
    <!-- todo: dl -->

    <!-- el-dt -->
    <dl>
      <dt data-testname="el-dt" data-expectedrole="term" class="ex">x</dt>
      <dd>x</dd>
    </dl>

    <em data-testname="el-em" data-expectedrole="emphasis" class="ex">x</em>
    <!-- todo: embed -->
    <fieldset data-testname="el-fieldset" data-expectedrole="group" class="ex"><legend>x</legend><input></fieldset>
    <!-- todo: figcaption -->
    <figure data-testname="el-figure" data-expectedrole="figure" class="ex"><img src="#" alt="x"><figcaption>x</figcaption></figure>

    <!-- el-footer -->
    <nav>
      <footer data-testname="el-footer" data-expectedrole="generic" aria-label="x" class="ex">x</aside>
    </nav>
    <footer data-testname="el-footer-ancestorbody" data-expectedrole="contentinfo" class="ex">x</footer>

    <form data-testname="el-form" data-expectedrole="form" class="ex"><input></form>
    <!-- todo: form-associated custom element -->

    <!-- el-h1-h6 -->
    <h1 data-testname="el-h1" data-expectedrole="heading" class="ex">x</h1>
    <h2 data-testname="el-h2" data-expectedrole="heading" class="ex">x</h2>
    <h3 data-testname="el-h3" data-expectedrole="heading" class="ex">x</h3>
    <h4 data-testname="el-h4" data-expectedrole="heading" class="ex">x</h4>
    <h5 data-testname="el-h5" data-expectedrole="heading" class="ex">x</h5>
    <h6 data-testname="el-h6" data-expectedrole="heading" class="ex">x</h6>

    <!-- head (not mapped) -->

    <!-- el-header -->
    <nav>
      <header data-testname="el-header" data-expectedrole="generic" aria-label="x" class="ex">x</header>
    </nav>
    <header data-testname="el-header-ancestorbody" data-expectedrole="banner" class="ex">x</header>

    <hgroup data-testname="el-hgroup" data-expectedrole="group" class="ex"><h1>x</h1></hgroup>
    <hr data-testname="el-hr" data-expectedrole="separator" class="ex">
    <!-- todo: html -->
    <i data-testname="el-i" data-expectedrole="generic" class="ex">x</i>
    <!-- todo: iframe -->
    <img src="#" alt="x" data-testname="el-img" data-expectedrole="image" class="ex">

    <!-- Implementations might also be valid if ignored rather than returning 'none' for the following images. -->
    <img src="#" alt data-testname="el-img-alt-no-value" data-expectedrole="none" class="ex">
    <img src="#" alt="" data-testname="el-img-empty-alt" data-expectedrole="none" class="ex">

    <input type="button" value="x" data-testname="el-input-button" data-expectedrole="button" class="ex">
    <input type="checkbox" data-testname="el-input-checkbox" data-expectedrole="checkbox" class="ex">
    <!-- todo: input type="color" -->
    <!-- todo: input type="date" -->
    <!-- todo: input type="datetime" -->
    <!-- todo: input type="datetime-local" -->
    <input type="email" data-testname="el-input-email" data-expectedrole="textbox" class="ex">
    <!-- todo: input type="file" -->
    <!-- input type="hidden" (not mapped) -->
    <!-- todo: input type="month" -->

    <!-- Blocked: HTML-AAM Issue #467 -->
    <!-- <input type="number" data-testname="el-input-number" data-expectedrole="spinbutton" class="ex"> -->

    <!-- todo: input type="password" -->
    <input type="radio" data-testname="el-input-radio" data-expectedrole="radio" class="ex">
    <input type="range" data-testname="el-input-range" data-expectedrole="slider" class="ex">
    <input type="reset" value="x" data-testname="el-input-reset" data-expectedrole="button" class="ex">
    <input type="search" data-testname="el-input-search" data-expectedrole="searchbox" class="ex">
    <input type="submit" value="x" data-testname="el-input-submit" data-expectedrole="button" class="ex">
    <input type="tel" data-testname="el-input-tel" data-expectedrole="textbox" class="ex">
    <input type="text" data-testname="el-input-text" data-expectedrole="textbox" class="ex">
    <!-- todo: input (type attribute in the Text, Search, Telephone, URL, or E-mail states with a suggestions source element) -->
    <!-- todo: input type="time" -->
    <input type="url" data-testname="el-input-url" data-expectedrole="textbox" class="ex">
    <!-- todo: input type="week" -->
    <ins data-testname="el-ins" data-expectedrole="insertion" class="ex">x</ins>
    <!-- todo: kbd -->
    <!-- todo: label -->
    <!-- todo: legend -->

    <!-- el-li -->
    <li data-testname="el-li-orphaned" data-expectedrole="generic" class="ex">x</li>
    <ul><li data-testname="el-li-in-ul" data-expectedrole="listitem" class="ex">x</li><li>x</li></ul>
    <ol><li data-testname="el-li-in-ol" data-expectedrole="listitem" class="ex">x</li><li>x</li></ol>

    <!-- link (not mapped) -->
    <main data-testname="el-main" data-expectedrole="main" class="ex">x</main>
    <!-- map (not mapped) -->
    <mark data-testname="el-mark" data-expectedrole="mark" class="ex">x</mark>
    <!-- todo: math -->
    <menu data-testname="el-menu" data-expectedrole="list" class="ex"><li>x</li></menu>
    <!-- meta (not mapped) -->
    <meter data-testname="el-meter" data-expectedrole="meter" class="ex" min="0" max="100" low="20" high="80" optimum="60" value="50">x</meter>
    <nav data-testname="el-nav" data-expectedrole="navigation" class="ex">x</nav>
    <!-- noscript (not mapped) -->
    <!-- object (not mapped) -->
    <ol data-testname="el-ol" data-expectedrole="list" class="ex"><li>x</li><li>x</li></ol>

    <!-- optgroup -> ./fragile/optgroup-role.html -->

    <!-- option -->
    <select>
      <option data-testname="el-option" data-expectedrole="option" class="ex">x</option>
      <option>x</option>
    </select>

    <output data-testname="el-output" data-expectedrole="status" class="ex">x</output>
    <p data-testname="el-p" data-expectedrole="paragraph" class="ex">x</p>
    <!-- param (not mapped) -->
    <!-- todo: picture -->
    <pre data-testname="el-pre" data-expectedrole="generic" class="ex">x</pre>
    <progress data-testname="el-progress" data-expectedrole="progressbar" class="ex">x</progress>
    <q data-testname="el-q" data-expectedrole="generic" class="ex">x</q>
    <!-- todo: rp -> /ruby-aam? -->
    <!-- todo: rt -> /ruby-aam? -->
    <!-- todo: ruby -> /ruby-aam? -->
    <s data-testname="el-s" data-expectedrole="deletion" class="ex">x</s>
    <samp data-testname="el-samp" data-expectedrole="generic" class="ex">x</samp>
    <!-- script (not mapped) -->
    <search data-testname="el-search" data-expectedrole="search" class="ex">x</search>

    <!-- el-section -->
    <section data-testname="el-section" aria-label="x" data-expectedrole="region" class="ex">x</section>
    <section data-testname="el-section-no-name" data-expectedrole="generic" class="ex">x</section>

    <!-- Blocked: HTML-AAM Issue #467 -->
    <!-- <select data-testname="el-select-combobox" data-expectedrole="combobox" class="ex"><option>a1</option><option>a2</option></select>-->

    <select data-testname="el-select-listbox" size="2" data-expectedrole="listbox" class="ex"><option>b1</option><option>b2</option></select>

    <!-- slot (not mapped) -->
    <small data-testname="el-small" data-expectedrole="generic" class="ex">x</small>
    <!-- source (not mapped) -->
    <span data-testname="el-span" data-expectedrole="generic" class="ex">x</span>
    <strong data-testname="el-strong" data-expectedrole="strong" class="ex">x</strong>
    <!-- style (not mapped) -->
    <sub data-testname="el-sub" data-expectedrole="subscript" class="ex">x</sub>
    <!-- todo: summary -->
    <sup data-testname="el-sup" data-expectedrole="superscript" class="ex">x</sup>
    <!-- todo: svg (see /graphics-aam and /svg-aam tests) -->
    <!-- table -> ./table-roles.html -->
    <!-- tbody -> ./table-roles.html -->
    <!-- td -> ./table-roles.html -->
    <!-- template (not mapped) -->
    <!-- tfoot -> ./table-roles.html -->
    <!-- th -> ./table-roles.html -->
    <!-- thead -> ./table-roles.html -->
    <time data-testname="el-time" data-expectedrole="time" class="ex">x</time>
    <!-- title (not mapped) -->
    <!-- tr -> ./table-roles.html -->
    <textarea data-testname="el-textarea" data-expectedrole="textbox" class="ex">x</textarea>
    <!-- track (not mapped) -->
    <u data-testname="el-u" data-expectedrole="generic" class="ex">x</u>
    <ul data-testname="el-ul" data-expectedrole="list" class="ex"><li>x</li><li>x</li></ul>
    <!-- var (not mapped) -->
    <!-- todo: video -->
    <!-- wbr (not mapped) -->
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }
  });

  afterEach(async () => {
    document.body.innerHTML = "";

    await virtual.stop();
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "link, x",
      "x", // WONTFIX generic ignored by screen readers
      "x", // TODO: FAIL address should have role group
      "article",
      "x",
      "end of article",
      "navigation",
      "complementary, x",
      "complementary",
      "x",
      "end of complementary",
      "end of navigation",
      "complementary",
      "x",
      "end of complementary",
      "x", // WONTFIX generic ignored by screen readers
      "x", // WONTFIX generic ignored by screen readers
      "x", // WONTFIX generic ignored by screen readers
      "x", // TODO: FAIL blockquote should have role blockquote
      "button, x",
      "x", // TODO: FAIL code should have role code
      "x", // WONTFIX generic ignored by screen readers
      "term",
      "x",
      "end of term",
      "definition",
      "x",
      "end of definition",
      "x", // TODO: FAIL del should have role deletion
      "group",
      "button, x",
      "x",
      "end of group",
      "term",
      "x",
      "end of term",
      "x", // WONTFIX generic ignored by screen readers
      "term",
      "x",
      "end of term",
      "definition",
      "x",
      "end of definition",
      "x", // TODO: FAIL em should have role emphasis
      "group, x",
      "figure",
      "img, x",
      "x",
      "end of figure",
      "navigation",
      "contentinfo, x",
      "end of navigation",
      "contentinfo",
      "x",
      "end of contentinfo",
      "form",
      "textbox",
      "end of form",
      "heading, x",
      "heading, x",
      "heading, x",
      "heading, x",
      "heading, x",
      "heading, x",
      "navigation",
      "banner, x", // TODO: FAIL header role should be generic
      "end of navigation",
      "banner",
      "x",
      "end of banner",
      "heading, x", // TODO: FAIL hgroup missing role
      "separator",
      "x", // WONTFIX generic ignored by screen readers
      "img, x", // TODO: FAIL img role should be image
      // PASS on missing img entry
      // PASS on missing img entry
      "button, x",
      "checkbox",
      "textbox",
      "radio",
      "slider",
      "button, x",
      "searchbox",
      "button, x",
      "textbox",
      "textbox",
      "textbox",
      "x", // TODO: FAIL ins missing insertion role
      "listitem", // TODO: FAIL orphaned li should not be announced
      "x",
      "end of listitem",
      "list",
      "listitem",
      "x",
      "end of listitem",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      "list",
      "listitem",
      "x",
      "end of listitem",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      "main",
      "x",
      "end of main",
      "x", // TODO: FAIL mark should have mark role
      "list",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      "x", // TODO: FAIL meter should have meter role
      "navigation",
      "x",
      "end of navigation",
      "list",
      "listitem",
      "x",
      "end of listitem",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      "combobox, not expanded",
      "option, x, not selected",
      "option, x, not selected",
      "end of combobox, not expanded",
      "status",
      "x",
      "end of status",
      "x", // TODO: FAIL p should have paragraph role
      "x", // WONTFIX generic ignored by screen readers
      "progressbar",
      "x",
      "end of progressbar",
      "x",
      "x", // TODO: FAIL s should have deletion role
      "x", // WONTFIX generic ignored by screen readers
      "x", // TODO: FAIL search should have search role
      "region, x",
      "region", // TODO: FAIL section with no name should be generic
      "x",
      "end of region",
      "listbox",
      "option, b1, not selected",
      "option, b2, not selected",
      "end of listbox",
      "x", // WONTFIX generic ignored by screen readers
      "x", // WONTFIX generic ignored by screen readers
      "x", // TODO: FAIL strong should have strong role
      "x", // TODO: FAIL sub should have subscript role
      "x", // TODO: FAIL sup should have superscript role
      "x", // TODO: FAIL time should have time role
      "textbox",
      "x",
      "end of textbox",
      "x", // WONTFIX generic ignored by screen readers
      "list",
      "listitem",
      "x",
      "end of listitem",
      "listitem",
      "x",
      "end of listitem",
      "end of list",
      "end of document",
    ]);
  });
});
