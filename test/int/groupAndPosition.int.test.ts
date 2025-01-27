import { virtual } from "../../src/index.js";

describe("Group & Position", () => {
  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("should handle list items", async () => {
    document.body.innerHTML = `
    <ul>
      <li>Meat</li>
      <li aria-owns="child-list">Fruit</li>
      <li>Vegetable</li>
    </ul>
    
    <ul id="child-list">
      <li>Apple</li>
      <li>Banana</li>
    </ul>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "list",
      "listitem, level 1, position 1, set size 3",
      "Meat",
      "end of listitem, level 1, position 1, set size 3",
      "listitem, level 1, position 2, set size 3",
      "Fruit",
      "list",
      "listitem, level 2, position 1, set size 2",
      "Apple",
      "end of listitem, level 2, position 1, set size 2",
      "listitem, level 2, position 2, set size 2",
      "Banana",
      "end of listitem, level 2, position 2, set size 2",
      "end of list",
      "end of listitem, level 1, position 2, set size 3",
      "listitem, level 1, position 3, set size 3",
      "Vegetable",
      "end of listitem, level 1, position 3, set size 3",
      "end of list",
      "end of document",
    ]);
  });

  test("should handle lists with owned list items taken from elsewhere and intermediary presentational elements", async () => {
    document.body.innerHTML = `
    <ul aria-owns="fruit vegetable">
      <li role="none"><a href="#meat" role="listitem">Meat</a></li>
    </ul>
    
    <li id="fruit" role="none"><a href="#fruit" role="listitem">Fruit</a></li>
    <li id="vegetable" role="none"><a href="#vegetable" role="listitem">Vegetable</a></li>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "list",
      "listitem, level 1, position 1, set size 3",
      "Meat",
      "end of listitem, level 1, position 1, set size 3",
      "listitem, level 1, position 2, set size 3",
      "Fruit",
      "end of listitem, level 1, position 2, set size 3",
      "listitem, level 1, position 3, set size 3",
      "Vegetable",
      "end of listitem, level 1, position 3, set size 3",
      "end of list",
      "end of document",
    ]);
  });

  test("should handle trees with implicit levels, set size, and position", async () => {
    document.body.innerHTML = `
  <ul class="treeview-navigation" role="tree" aria-label="Mythical University">
    <li role="none">
      <a role="treeitem" href="#home" aria-current="page">
        <span class="label">Home</span>
      </a>
    </li>
    <li role="none">
      <a role="treeitem" aria-expanded="false" aria-owns="id-about-subtree" href="#about">
        <span class="label">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10">
              <polygon points="2 1, 12 1, 7 9"></polygon>
            </svg>
          </span>
          About
        </span>
      </a>
      <ul id="id-about-subtree" role="group" aria-label="About">
        <li role="none">
          <a role="treeitem" href="#overview">
            <span class="label">Overview</span>
          </a>
        </li>
        <li role="none">
          <a role="treeitem" href="#adminstration">
            <span class="label">Administration</span>
          </a>
        </li>
        <li role="none">
          <a role="treeitem" aria-expanded="false" aria-owns="id-facts-subtree" href="#facts">
            <span class="label">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10">
                  <polygon points="2 1, 12 1, 7 9"></polygon>
                </svg>
              </span>
              Facts
            </span>
          </a>
          <ul id="id-facts-subtree" role="group" aria-label="Facts">
            <li role="none">
              <a role="treeitem" href="#history">
                <span class="label">History</span>
              </a>
            </li>
            <li role="none">
              <a role="treeitem" href="#current-statistics">
                <span class="label"> Current Statistics </span>
              </a>
            </li>
            <li role="none">
              <a role="treeitem" href="#awards">
                <span class="label">Awards</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "tree, Mythical University, orientated vertically",
      "treeitem, Home, current page, level 1, position 1, set size 2, not selected",
      "Home",
      "end of treeitem, Home, current page, level 1, position 1, set size 2, not selected",
      "treeitem, About About, not expanded, level 1, position 2, set size 2, not selected",
      "graphics-document",
      "About",
      "group, About",
      "treeitem, Overview, level 2, position 1, set size 3, not selected",
      "Overview",
      "end of treeitem, Overview, level 2, position 1, set size 3, not selected",
      "treeitem, Administration, level 2, position 2, set size 3, not selected",
      "Administration",
      "end of treeitem, Administration, level 2, position 2, set size 3, not selected",
      "treeitem, Facts Facts, not expanded, level 2, position 3, set size 3, not selected",
      "graphics-document",
      "Facts",
      "group, Facts",
      "treeitem, History, level 3, position 1, set size 3, not selected",
      "History",
      "end of treeitem, History, level 3, position 1, set size 3, not selected",
      "treeitem, Current Statistics, level 3, position 2, set size 3, not selected",
      "Current Statistics",
      "end of treeitem, Current Statistics, level 3, position 2, set size 3, not selected",
      "treeitem, Awards, level 3, position 3, set size 3, not selected",
      "Awards",
      "end of treeitem, Awards, level 3, position 3, set size 3, not selected",
      "end of group, Facts",
      "end of treeitem, Facts Facts, not expanded, level 2, position 3, set size 3, not selected",
      "end of group, About",
      "end of treeitem, About About, not expanded, level 1, position 2, set size 2, not selected",
      "end of tree, Mythical University, orientated vertically",
      "end of document",
    ]);
  });

  test("should handle trees with explicit levels, set size, and position", async () => {
    document.body.innerHTML = `
<h1 id="tree1">My Documents</h3>
<ul role="tree" aria-labelledby="tree1">
  <li role="treeitem" aria-level="1" aria-setsize="2" aria-posinset="1" aria-expanded="false" aria-selected="false">
    <span> Projects </span>
    <ul role="group">
      <li role="treeitem" aria-level="2" aria-setsize="5" aria-posinset="1" aria-selected="false" class="doc">project-1.docx</li>
      <li role="treeitem" aria-level="2" aria-setsize="5" aria-posinset="2" aria-selected="false" class="doc">project-2.docx</li>
      <li role="treeitem" aria-level="2" aria-setsize="5" aria-posinset="3" aria-expanded="false" aria-selected="false">
        <span> project-3 </span>
        <ul role="group">
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="1" aria-selected="false" class="doc">project-3A.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="2" aria-selected="false" class="doc">project-3B.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="3" aria-selected="false" class="doc">project-3C.docx</li>
        </ul>
      </li>
      <li role="treeitem" aria-level="2" aria-setsize="5" aria-posinset="4" aria-selected="false" class="doc">project-4.docx</li>
      <li role="treeitem" aria-level="2" aria-setsize="5" aria-posinset="5" aria-expanded="false" aria-selected="false">
        <span> project-5 </span>
        <ul role="group">
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="1" aria-selected="false" class="doc">project-5A.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="2" aria-selected="false" class="doc">project-5B.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="3" aria-selected="false" class="doc">project-5C.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="4" aria-selected="false" class="doc">project-5D.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="5" aria-selected="false" class="doc">project-5E.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="6" aria-posinset="6" aria-selected="false" class="doc">project-5F.docx</li>
        </ul>
      </li>
    </ul>
  </li>
  <li role="treeitem" aria-level="1" aria-setsize="2" aria-posinset="2" aria-expanded="false" aria-selected="false">
    <span> Reports </span>
    <ul role="group">
      <li role="treeitem" aria-level="2" aria-setsize="3" aria-posinset="1" aria-expanded="false" aria-selected="false">
        <span> report-1 </span>
        <ul role="group">
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="1" aria-selected="false" class="doc">report-1A.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="2" aria-selected="false" class="doc">report-1B.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="3" aria-posinset="3" aria-selected="false" class="doc">report-1C.docx</li>
        </ul>
      </li>
      <li role="treeitem" aria-level="2" aria-setsize="3" aria-posinset="2" aria-expanded="false" aria-selected="false">
        <span> report-2 </span>
        <ul role="group">
          <li role="treeitem" aria-level="3" aria-setsize="4" aria-posinset="1" aria-selected="false" class="doc">report-2A.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="4" aria-posinset="2" aria-selected="false" class="doc">report-2B.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="4" aria-posinset="3" aria-selected="false" class="doc">report-2C.docx</li>
          <li role="treeitem" aria-level="3" aria-setsize="4" aria-posinset="4" aria-selected="false" class="doc">report-2D.docx</li>
        </ul>
      </li>
      <li role="treeitem" aria-level="2" aria-setsize="3" aria-posinset="3" aria-expanded="false" aria-selected="false">
        <span> report-3 </span>
        <ul role="group">
          <li role="treeitem" aria-level="3" aria-setsize="1" aria-posinset="1" aria-selected="false" class="doc">report-3A.docx</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, My Documents, level 1",
      "tree, My Documents, orientated vertically",
      "treeitem, Projects project-1.docx project-2.docx project-3 project-3A.docx project-3B.docx project-3C.docx project-4.docx project-5 project-5A.docx project-5B.docx project-5C.docx project-5D.docx project-5E.docx project-5F.docx, not expanded, level 1, position 1, set size 2, not selected",
      "Projects",
      "group",
      "treeitem, project-1.docx, level 2, position 1, set size 5, not selected",
      "treeitem, project-2.docx, level 2, position 2, set size 5, not selected",
      "treeitem, project-3 project-3A.docx project-3B.docx project-3C.docx, not expanded, level 2, position 3, set size 5, not selected",
      "project-3",
      "group",
      "treeitem, project-3A.docx, level 3, position 1, set size 3, not selected",
      "treeitem, project-3B.docx, level 3, position 2, set size 3, not selected",
      "treeitem, project-3C.docx, level 3, position 3, set size 3, not selected",
      "end of group",
      "end of treeitem, project-3 project-3A.docx project-3B.docx project-3C.docx, not expanded, level 2, position 3, set size 5, not selected",
      "treeitem, project-4.docx, level 2, position 4, set size 5, not selected",
      "treeitem, project-5 project-5A.docx project-5B.docx project-5C.docx project-5D.docx project-5E.docx project-5F.docx, not expanded, level 2, position 5, set size 5, not selected",
      "project-5",
      "group",
      "treeitem, project-5A.docx, level 3, position 1, set size 6, not selected",
      "treeitem, project-5B.docx, level 3, position 2, set size 6, not selected",
      "treeitem, project-5C.docx, level 3, position 3, set size 6, not selected",
      "treeitem, project-5D.docx, level 3, position 4, set size 6, not selected",
      "treeitem, project-5E.docx, level 3, position 5, set size 6, not selected",
      "treeitem, project-5F.docx, level 3, position 6, set size 6, not selected",
      "end of group",
      "end of treeitem, project-5 project-5A.docx project-5B.docx project-5C.docx project-5D.docx project-5E.docx project-5F.docx, not expanded, level 2, position 5, set size 5, not selected",
      "end of group",
      "end of treeitem, Projects project-1.docx project-2.docx project-3 project-3A.docx project-3B.docx project-3C.docx project-4.docx project-5 project-5A.docx project-5B.docx project-5C.docx project-5D.docx project-5E.docx project-5F.docx, not expanded, level 1, position 1, set size 2, not selected",
      "treeitem, Reports report-1 report-1A.docx report-1B.docx report-1C.docx report-2 report-2A.docx report-2B.docx report-2C.docx report-2D.docx report-3 report-3A.docx, not expanded, level 1, position 2, set size 2, not selected",
      "Reports",
      "group",
      "treeitem, report-1 report-1A.docx report-1B.docx report-1C.docx, not expanded, level 2, position 1, set size 3, not selected",
      "report-1",
      "group",
      "treeitem, report-1A.docx, level 3, position 1, set size 3, not selected",
      "treeitem, report-1B.docx, level 3, position 2, set size 3, not selected",
      "treeitem, report-1C.docx, level 3, position 3, set size 3, not selected",
      "end of group",
      "end of treeitem, report-1 report-1A.docx report-1B.docx report-1C.docx, not expanded, level 2, position 1, set size 3, not selected",
      "treeitem, report-2 report-2A.docx report-2B.docx report-2C.docx report-2D.docx, not expanded, level 2, position 2, set size 3, not selected",
      "report-2",
      "group",
      "treeitem, report-2A.docx, level 3, position 1, set size 4, not selected",
      "treeitem, report-2B.docx, level 3, position 2, set size 4, not selected",
      "treeitem, report-2C.docx, level 3, position 3, set size 4, not selected",
      "treeitem, report-2D.docx, level 3, position 4, set size 4, not selected",
      "end of group",
      "end of treeitem, report-2 report-2A.docx report-2B.docx report-2C.docx report-2D.docx, not expanded, level 2, position 2, set size 3, not selected",
      "treeitem, report-3 report-3A.docx, not expanded, level 2, position 3, set size 3, not selected",
      "report-3",
      "group",
      "treeitem, report-3A.docx, level 3, position 1, set size 1, not selected",
      "end of group",
      "end of treeitem, report-3 report-3A.docx, not expanded, level 2, position 3, set size 3, not selected",
      "end of group",
      "end of treeitem, Reports report-1 report-1A.docx report-1B.docx report-1C.docx report-2 report-2A.docx report-2B.docx report-2C.docx report-2D.docx report-3 report-3A.docx, not expanded, level 1, position 2, set size 2, not selected",
      "end of tree, My Documents, orientated vertically",
      "end of document",
    ]);
  });

  test("should handle tabs", async () => {
    document.body.innerHTML = `
<h3 id="tablist-1">Danish Composers</h3>
<div role="tablist" aria-labelledby="tablist-1" class="automatic">
  <button id="tab-1" type="button" role="tab" aria-selected="true" aria-controls="tabpanel-1">
    <span class="focus">Maria Ahlefeldt</span>
  </button>
  <button id="tab-2" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-2" tabindex="-1">
    <span class="focus">Carl Andersen</span>
  </button>
  <button id="tab-3" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-3" tabindex="-1">
    <span class="focus">Ida da Fonseca</span>
  </button>
  <button id="tab-4" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-4" tabindex="-1">
    <span class="focus">Peter Müller</span>
  </button>
</div>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, Danish Composers, level 3",
      "tablist, Danish Composers, orientated horizontally",
      "tab, Maria Ahlefeldt, position 1, set size 4, selected",
      "tab, Carl Andersen, position 2, set size 4, not selected",
      "tab, Ida da Fonseca, position 3, set size 4, not selected",
      "tab, Peter Müller, position 4, set size 4, not selected",
      "end of tablist, Danish Composers, orientated horizontally",
      "end of document",
    ]);
  });

  test("should handle menus", async () => {
    document.body.innerHTML = `
<ul role="menubar" aria-label="Text Formatting">
  <li role="none">
    <span role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="0">Font<span aria-hidden="true"></span></span>
    <ul role="menu" data-option="font-family" aria-label="Font">
      <li role="menuitemradio" aria-checked="true"><span aria-hidden="true"></span>Sans-serif</li>
      <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Serif</li>
      <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Monospace</li>
      <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Fantasy</li>
    </ul>
  </li>
  <li role="none">
    <span role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="-1">Style/Color<span aria-hidden="true"></span></span>
    <ul role="menu" aria-label="Style/Color">
      <li role="none">
        <ul role="group" data-option="font-style" aria-label="Font Style">
          <li role="menuitemcheckbox" data-option="font-bold" aria-checked="false"><span aria-hidden="true"></span>Bold</li>
          <li role="menuitemcheckbox" data-option="font-italic" aria-checked="false"><span aria-hidden="true"></span>Italic</li>
        </ul>
      </li>
      <li role="separator"></li>
      <li role="none">
        <ul role="group" data-option="font-color" aria-label="Text Color">
          <li role="menuitemradio" aria-checked="true"><span aria-hidden="true"></span>Black</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Blue</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Red</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Green</li>
        </ul>
      </li>
      <li role="separator"></li>
      <li role="none">
        <ul role="group" data-option="text-decoration" aria-label="Text Decoration">
          <li role="menuitemradio" aria-checked="true"><span aria-hidden="true"></span>None</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Overline</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Line-through</li>
          <li role="menuitemradio" aria-checked="false"><span aria-hidden="true"></span>Underline</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "menubar, Text Formatting, orientated horizontally",
      "menuitem, Font, not expanded, has popup menu, position 1, set size 2",
      "menu, Font, orientated vertically",
      "menuitemradio, Sans-serif, checked, position 1, set size 4",
      "menuitemradio, Serif, not checked, position 2, set size 4",
      "menuitemradio, Monospace, not checked, position 3, set size 4",
      "menuitemradio, Fantasy, not checked, position 4, set size 4",
      "end of menu, Font, orientated vertically",
      "menuitem, Style/Color, not expanded, has popup menu, position 2, set size 2",
      "menu, Style/Color, orientated vertically",
      "group, Font Style",
      "menuitemcheckbox, Bold, not checked, position 1, set size 2",
      "menuitemcheckbox, Italic, not checked, position 2, set size 2",
      "end of group, Font Style",
      "separator, orientated horizontally, max value 100, min value 0",
      "group, Text Color",
      "menuitemradio, Black, checked, position 1, set size 4",
      "menuitemradio, Blue, not checked, position 2, set size 4",
      "menuitemradio, Red, not checked, position 3, set size 4",
      "menuitemradio, Green, not checked, position 4, set size 4",
      "end of group, Text Color",
      "separator, orientated horizontally, max value 100, min value 0",
      "group, Text Decoration",
      "menuitemradio, None, checked, position 1, set size 4",
      "menuitemradio, Overline, not checked, position 2, set size 4",
      "menuitemradio, Line-through, not checked, position 3, set size 4",
      "menuitemradio, Underline, not checked, position 4, set size 4",
      "end of group, Text Decoration",
      "end of menu, Style/Color, orientated vertically",
      "end of menubar, Text Formatting, orientated horizontally",
      "end of document",
    ]);
  });

  test("should handle options", async () => {
    document.body.innerHTML = `
<div class="listbox-area">
  <div>
    <span id="ss_elem" class="listbox-label">Choose your animal sidekick</span>
    <div id="ss_elem_list" tabindex="0" role="listbox" aria-labelledby="ss_elem">
      <ul role="group" aria-labelledby="cat1">
        <li role="presentation" id="cat1">Land</li>
        <li id="ss_elem_1" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Cat
        </li>
        <li id="ss_elem_2" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Dog
        </li>
        <li id="ss_elem_3" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Tiger
        </li>
        <li id="ss_elem_4" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Reindeer
        </li>
        <li id="ss_elem_5" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Raccoon
        </li>
      </ul>
      <ul role="group" aria-labelledby="cat2">
        <li role="presentation" id="cat2">
          <span class="checkmark" aria-hidden="true"></span>
          Water
        </li>
        <li id="ss_elem_6" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Dolphin
        </li>
        <li id="ss_elem_7" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Flounder
        </li>
        <li id="ss_elem_8" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Eel
        </li>
      </ul>
      <ul role="group" aria-labelledby="cat3">
        <li role="presentation" id="cat3">Air</li>
        <li id="ss_elem_9" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Falcon
        </li>
        <li id="ss_elem_10" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Winged Horse
        </li>
        <li id="ss_elem_11" role="option">
          <span class="checkmark" aria-hidden="true"></span>
          Owl
        </li>
      </ul>
    </div>
  </div>
</div>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "Choose your animal sidekick",
      "listbox, Choose your animal sidekick, orientated vertically",
      "group, Land",
      "Land",
      "option, Cat, position 1, set size 5, not selected",
      "option, Dog, position 2, set size 5, not selected",
      "option, Tiger, position 3, set size 5, not selected",
      "option, Reindeer, position 4, set size 5, not selected",
      "option, Raccoon, position 5, set size 5, not selected",
      "end of group, Land",
      "group, Water",
      "Water",
      "option, Dolphin, position 1, set size 3, not selected",
      "option, Flounder, position 2, set size 3, not selected",
      "option, Eel, position 3, set size 3, not selected",
      "end of group, Water",
      "group, Air",
      "Air",
      "option, Falcon, position 1, set size 3, not selected",
      "option, Winged Horse, position 2, set size 3, not selected",
      "option, Owl, position 3, set size 3, not selected",
      "end of group, Air",
      "end of listbox, Choose your animal sidekick, orientated vertically",
      "end of document",
    ]);
  });

  test("should handle radio groups", async () => {
    document.body.innerHTML = `
<h3 id="group_label_1">Pizza Crust</h3>

<ul class="radiogroup-activedescendant" role="radiogroup" aria-labelledby="group_label_1" aria-activedescendant="rb11" tabindex="0">
  <li id="rb11" role="radio" aria-checked="false">Regular crust</li>
  <li id="rb12" role="radio" aria-checked="false">Deep dish</li>
  <li id="rb13" role="radio" aria-checked="false">Thin crust</li>
</ul>

<h3 id="group_label_2">Pizza Delivery</h3>

<ul class="radiogroup-activedescendant" role="radiogroup" aria-labelledby="group_label_2" aria-activedescendant="rb21" tabindex="0">
  <li id="rb21" role="radio" aria-checked="false">Pick up</li>
  <li id="rb22" role="radio" aria-checked="false">Home Delivery</li>
  <li id="rb23" role="radio" aria-checked="false">Dine in Restaurant</li>
</ul>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "heading, Pizza Crust, level 3",
      "radiogroup, Pizza Crust, active descendant Regular crust",
      "radio, Regular crust, not checked, position 1, set size 3",
      "radio, Deep dish, not checked, position 2, set size 3",
      "radio, Thin crust, not checked, position 3, set size 3",
      "end of radiogroup, Pizza Crust, active descendant Regular crust",
      "heading, Pizza Delivery, level 3",
      "radiogroup, Pizza Delivery, active descendant Pick up",
      "radio, Pick up, not checked, position 1, set size 3",
      "radio, Home Delivery, not checked, position 2, set size 3",
      "radio, Dine in Restaurant, not checked, position 3, set size 3",
      "end of radiogroup, Pizza Delivery, active descendant Pick up",
      "end of document",
    ]);
  });

  test("should not add group and position information to table rows", async () => {
    document.body.innerHTML = `
<div class="table-wrap"><table class="sortable">
<caption>
  Students currently enrolled in WAI-ARIA 101
  <span class="sr-only">, column headers with buttons are sortable.</span>
</caption>
<thead>
  <tr>
    <th scope="colgroup">
      <button>
        First Name
        <span aria-hidden="true"></span>
      </button>
    </th>
    <th scope="colgroup" aria-sort="ascending">
      <button>
        Last Name
        <span aria-hidden="true"></span>
      </button>
    </th>
    <th scope="colgroup">
      <button>
        Company
        <span aria-hidden="true"></span>
      </button>
    </th>
    <th scope="colgroup" class="no-sort">Address</th>
    <th scope="colgroup" class="num">
      <button>
        Favorite Number
        <span aria-hidden="true"></span>
      </button>
    </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Fred</td>
    <td>Jackson</td>
    <td>Canary, Inc.</td>
    <td>123 Broad St.</td>
    <td class="num">56</td>
  </tr>
  <tr>
    <td>Sara</td>
    <td>James</td>
    <td>Cardinal, Inc.</td>
    <td>457 First St.</td>
    <td class="num">7</td>
  </tr>
  <tr>
    <td>Ralph</td>
    <td>Jefferson</td>
    <td>Robin, Inc.</td>
    <td>456 Main St.</td>
    <td class="num">513</td>
  </tr>
  <tr>
    <td>Nancy</td>
    <td>Jensen</td>
    <td>Eagle, Inc.</td>
    <td>2203 Logan Dr.</td>
    <td class="num">3.5</td>
  </tr>
</tbody>
</table></div>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "table, Students currently enrolled in WAI-ARIA 101 , column headers with buttons are sortable.",
      "caption, Students currently enrolled in WAI-ARIA 101 , column headers with buttons are sortable.",
      "Students currently enrolled in WAI-ARIA 101",
      ", column headers with buttons are sortable.",
      "end of caption, Students currently enrolled in WAI-ARIA 101 , column headers with buttons are sortable.",
      "rowgroup",
      "row, First Name Last Name Company Address Favorite Number",
      "columnheader, First Name",
      "button, First Name",
      "end of columnheader, First Name",
      "columnheader, Last Name, sorted in ascending order",
      "button, Last Name",
      "end of columnheader, Last Name, sorted in ascending order",
      "columnheader, Company",
      "button, Company",
      "end of columnheader, Company",
      "columnheader, Address",
      "columnheader, Favorite Number",
      "button, Favorite Number",
      "end of columnheader, Favorite Number",
      "end of row, First Name Last Name Company Address Favorite Number",
      "end of rowgroup",
      "rowgroup",
      "row, Fred Jackson Canary, Inc. 123 Broad St. 56",
      "cell, Fred",
      "cell, Jackson",
      "cell, Canary, Inc.",
      "cell, 123 Broad St.",
      "cell, 56",
      "end of row, Fred Jackson Canary, Inc. 123 Broad St. 56",
      "row, Sara James Cardinal, Inc. 457 First St. 7",
      "cell, Sara",
      "cell, James",
      "cell, Cardinal, Inc.",
      "cell, 457 First St.",
      "cell, 7",
      "end of row, Sara James Cardinal, Inc. 457 First St. 7",
      "row, Ralph Jefferson Robin, Inc. 456 Main St. 513",
      "cell, Ralph",
      "cell, Jefferson",
      "cell, Robin, Inc.",
      "cell, 456 Main St.",
      "cell, 513",
      "end of row, Ralph Jefferson Robin, Inc. 456 Main St. 513",
      "row, Nancy Jensen Eagle, Inc. 2203 Logan Dr. 3.5",
      "cell, Nancy",
      "cell, Jensen",
      "cell, Eagle, Inc.",
      "cell, 2203 Logan Dr.",
      "cell, 3.5",
      "end of row, Nancy Jensen Eagle, Inc. 2203 Logan Dr. 3.5",
      "end of rowgroup",
      "end of table, Students currently enrolled in WAI-ARIA 101 , column headers with buttons are sortable.",
      "end of document",
    ]);
  });

  test("should add group and position information to treegrid rows", async () => {
    document.body.innerHTML = `
<div class="table-wrap"><table id="treegrid" role="treegrid" aria-label="Inbox">
<colgroup>
  <col id="treegrid-col1">
  <col id="treegrid-col2">
  <col id="treegrid-col3">
</colgroup>
<thead>
  <tr>
    <th scope="col">Subject</th>
    <th scope="col">Summary</th>
    <th scope="col">Email</th>
  </tr>
</thead>
<tbody>
  <tr role="row" aria-owns="level-2a level-2b level-2c" aria-expanded="true">
    <td role="gridcell">Treegrids are awesome</td>
    <td role="gridcell">Want to learn how to use them?</td>
    <td role="gridcell"><a href="mailto:aaron@thegoogle.rocks">aaron@thegoogle.rocks</a></td>
  </tr>
  <tr id="level-2a" role="row">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">I agree with you, they are the shizzle</td>
    <td role="gridcell"><a href="mailto:joe@blahblahblah.blahblah">joe@blahblahblah.blahblah</a></td>
  </tr>
  <tr id="level-2b" aria-owns="level-3a" role="row" aria-expanded="false">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">They are great for showing a lot of data, like a grid</td>
    <td role="gridcell"><a href="mailto:billy@dangerous.fish">billy@dangerous.fish</a></td>
  </tr>
  <tr id="level-3a" role="row" class="hidden">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">Cool, we've been needing an example and documentation</td>
    <td role="gridcell"><a href="mailto:doris@rufflazydogs.sleep">doris@rufflazydogs.sleep</a></td>
  </tr>
  <tr id="level-2c" aria-owns="level-3b" role="row" aria-expanded="false">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">I hear the Fancytree library is going to align with this example!</td>
    <td role="gridcell"><a href="mailto:someone@please-do-it.company">someone@please-do-it.company</a></td>
  </tr>
  <tr id="level-3b" aria-owns="level-4a level-4b" role="row" aria-expanded="false" class="hidden">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">Sometimes they are more like trees, others are more like grids</td>
    <td role="gridcell"><a href="mailto:mari@beingpractical.com">mari@beingpractical.com</a></td>
  </tr>
  <tr id="level-4a" role="row" aria-level="4" class="hidden">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">Cool, when it's a tree, let's keep left/right to collapse/expand</td>
    <td role="gridcell"><a href="mailto:issie@imadeadcatsadly.wascute">issie@imadeadcatsadly.wascute</a></td>
  </tr>
  <tr id="level-4b" role="row" aria-level="4" class="hidden">
    <td role="gridcell">re: Treegrids are awesome</td>
    <td role="gridcell">I see, sometimes right arrow moves by column</td>
    <td role="gridcell"><a href="mailto:kitten@kittenseason.future">kitten@kittenseason.future</a></td>
  </tr>
</tbody>
</table></div>`;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "treegrid, Inbox",
      "rowgroup",
      "row, Subject Summary Email, level 1, position 1, set size 1",
      "columnheader, Subject",
      "columnheader, Summary",
      "columnheader, Email",
      "end of row, Subject Summary Email, level 1, position 1, set size 1",
      "end of rowgroup",
      "rowgroup",
      "row, Treegrids are awesome Want to learn how to use them? aaron@thegoogle.rocks re: Treegrids are awesome I agree with you, they are the shizzle joe@blahblahblah.blahblah re: Treegrids are awesome They are great for showing a lot of data, like a grid billy@dangerous.fish re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep re: Treegrids are awesome I hear the Fancytree library is going to align with this example! someone@please-do-it.company re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, expanded, level 1, position 1, set size 1",
      "gridcell, Treegrids are awesome",
      "gridcell, Want to learn how to use them?",
      "gridcell, aaron@thegoogle.rocks",
      "link, aaron@thegoogle.rocks",
      "end of gridcell, aaron@thegoogle.rocks",
      "row, re: Treegrids are awesome I agree with you, they are the shizzle joe@blahblahblah.blahblah, level 2, position 1, set size 3",
      "gridcell, re: Treegrids are awesome",
      "gridcell, I agree with you, they are the shizzle",
      "gridcell, joe@blahblahblah.blahblah",
      "link, joe@blahblahblah.blahblah",
      "end of gridcell, joe@blahblahblah.blahblah",
      "end of row, re: Treegrids are awesome I agree with you, they are the shizzle joe@blahblahblah.blahblah, level 2, position 1, set size 3",
      "row, re: Treegrids are awesome They are great for showing a lot of data, like a grid billy@dangerous.fish re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep, not expanded, level 2, position 2, set size 3",
      "gridcell, re: Treegrids are awesome",
      "gridcell, They are great for showing a lot of data, like a grid",
      "gridcell, billy@dangerous.fish",
      "link, billy@dangerous.fish",
      "end of gridcell, billy@dangerous.fish",
      "row, re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep, level 3, position 1, set size 1",
      "gridcell, re: Treegrids are awesome",
      "gridcell, Cool, we've been needing an example and documentation",
      "gridcell, doris@rufflazydogs.sleep",
      "link, doris@rufflazydogs.sleep",
      "end of gridcell, doris@rufflazydogs.sleep",
      "end of row, re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep, level 3, position 1, set size 1",
      "end of row, re: Treegrids are awesome They are great for showing a lot of data, like a grid billy@dangerous.fish re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep, not expanded, level 2, position 2, set size 3",
      "row, re: Treegrids are awesome I hear the Fancytree library is going to align with this example! someone@please-do-it.company re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, not expanded, level 2, position 3, set size 3",
      "gridcell, re: Treegrids are awesome",
      "gridcell, I hear the Fancytree library is going to align with this example!",
      "gridcell, someone@please-do-it.company",
      "link, someone@please-do-it.company",
      "end of gridcell, someone@please-do-it.company",
      "row, re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, not expanded, level 3, position 1, set size 1",
      "gridcell, re: Treegrids are awesome",
      "gridcell, Sometimes they are more like trees, others are more like grids",
      "gridcell, mari@beingpractical.com",
      "link, mari@beingpractical.com",
      "end of gridcell, mari@beingpractical.com",
      "row, re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute, level 4, position 1, set size 2",
      "gridcell, re: Treegrids are awesome",
      "gridcell, Cool, when it's a tree, let's keep left/right to collapse/expand",
      "gridcell, issie@imadeadcatsadly.wascute",
      "link, issie@imadeadcatsadly.wascute",
      "end of gridcell, issie@imadeadcatsadly.wascute",
      "end of row, re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute, level 4, position 1, set size 2",
      "row, re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, level 4, position 2, set size 2",
      "gridcell, re: Treegrids are awesome",
      "gridcell, I see, sometimes right arrow moves by column",
      "gridcell, kitten@kittenseason.future",
      "link, kitten@kittenseason.future",
      "end of gridcell, kitten@kittenseason.future",
      "end of row, re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, level 4, position 2, set size 2",
      "end of row, re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, not expanded, level 3, position 1, set size 1",
      "end of row, re: Treegrids are awesome I hear the Fancytree library is going to align with this example! someone@please-do-it.company re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, not expanded, level 2, position 3, set size 3",
      "end of row, Treegrids are awesome Want to learn how to use them? aaron@thegoogle.rocks re: Treegrids are awesome I agree with you, they are the shizzle joe@blahblahblah.blahblah re: Treegrids are awesome They are great for showing a lot of data, like a grid billy@dangerous.fish re: Treegrids are awesome Cool, we've been needing an example and documentation doris@rufflazydogs.sleep re: Treegrids are awesome I hear the Fancytree library is going to align with this example! someone@please-do-it.company re: Treegrids are awesome Sometimes they are more like trees, others are more like grids mari@beingpractical.com re: Treegrids are awesome Cool, when it's a tree, let's keep left/right to collapse/expand issie@imadeadcatsadly.wascute re: Treegrids are awesome I see, sometimes right arrow moves by column kitten@kittenseason.future, expanded, level 1, position 1, set size 1",
      "end of rowgroup",
      "end of treegrid, Inbox",
      "end of document",
    ]);
  });
});
