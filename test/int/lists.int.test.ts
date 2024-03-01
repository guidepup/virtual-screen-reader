import { virtual } from "../../src/index.js";

describe("next", () => {
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
      "listitem, position 1, group size 3",
      "Meat",
      "end of listitem, position 1, group size 3",
      "listitem, position 2, group size 3",
      "Fruit",
      "list",
      "listitem, position 1, group size 2",
      "Apple",
      "end of listitem, position 1, group size 2",
      "listitem, position 2, group size 2",
      "Banana",
      "end of listitem, position 2, group size 2",
      "end of list",
      "end of listitem, position 2, group size 3",
      "listitem, position 3, group size 3",
      "Vegetable",
      "end of listitem, position 3, group size 3",
      "end of list",
      "end of document",
    ]);
  });

  test("should handle tree items", async () => {
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
      "treeitem, Home, current page, position 1, group size 2, not selected",
      "treeitem, About About, not expanded, position 2, group size 2, not selected",
      "About",
      "group, About",
      "treeitem, Overview, position 1, group size 3, not selected",
      "treeitem, Administration, position 2, group size 3, not selected",
      "treeitem, Facts Facts, not expanded, position 3, group size 3, not selected",
      "Facts",
      "group, Facts",
      "treeitem, History, position 1, group size 3, not selected",
      "treeitem, Current Statistics, position 2, group size 3, not selected",
      "treeitem, Awards, position 3, group size 3, not selected",
      "end of group, Facts",
      "end of treeitem, Facts Facts, not expanded, position 3, group size 3, not selected",
      "end of group, About",
      "end of treeitem, About About, not expanded, position 2, group size 2, not selected",
      "end of tree, Mythical University, orientated vertically",
      "end of document",
    ]);
  });
});
