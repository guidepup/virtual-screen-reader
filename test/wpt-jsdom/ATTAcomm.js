const ACCESSIBILITY_API = "ATK";
const ATK_PROPERTY = "property";
const ATK_NAME = "name";
const ATK_DESCRIPTION = "description";
const ATK_ROLE = "role";
const ATK_OBJECT_ATTRIBUTES = "objectAttributes";

const atkRoleToWaiAriaMap = {
  ROLE_NOTIFICATION: "alert",
  ROLE_ALERT: "alertdialog",
  ROLE_EMBEDDED: "application",
  ROLE_ARTICLE: "article",
  ROLE_LANDMARK: [
    "banner",
    "complementary",
    "contentinfo",
    "form",
    "main",
    "navigation",
    "region",
    "search",
  ],
  ROLE_BLOCK_QUOTE: "blockquote",
  ROLE_PUSH_BUTTON: "button",
  ROLE_TOGGLE_BUTTON: ["button", "switch"],
  ROLE_CAPTION: "caption",
  ROLE_TABLE_CELL: ["cell", "gridcell"],
  ROLE_CHECK_BOX: "checkbox",
  ROLE_STATIC: ["code", "emphasis", "strong", "time"],
  ROLE_COLUMN_HEADER: "columnheader",
  ROLE_COMBO_BOX: "combobox",
  ROLE_COMMENT: ["comment", "note"],
  ROLE_DESCRIPTION_VALUE: "definition",
  ROLE_CONTENT_DELETION: "deletion",
  ROLE_DIALOG: "dialog",
  ROLE_LIST: ["directory", "list"],
  ROLE_DOCUMENT_FRAME: "document",
  ROLE_PANEL: ["feed", "figure", "group", "radiogroup", "rowgroup"],
  ROLE_SECTION: ["generic", "none", "presentation"],
  ROLE_TABLE: ["grid", "table"],
  ROLE_HEADING: "heading",
  ROLE_IMAGE: ["image", "img"],
  ROLE_CONTENT_INSERTION: "insertion",
  ROLE_LINK: "link",
  ROLE_LIST_BOX: "listbox",
  ROLE_MENU: ["listbox", "menu"],
  ROLE_LIST_ITEM: ["listitem", "option"],
  ROLE_LOG: "log",
  ROLE_MARK: "mark",
  ROLE_MARQUEE: "marquee",
  ROLE_MATH: "math",
  ROLE_MENU_BAR: "menubar",
  ROLE_MENU_ITEM: ["menuitem", "option"],
  ROLE_CHECK_MENU_ITEM: "menuitemcheckbox",
  ROLE_RADIO_MENU_ITEM: "menuitemradio",
  ROLE_LEVEL_BAR: "meter",
  ROLE_PARAGRAPH: "paragraph",
  ROLE_PROGRESS_BAR: "progressbar",
  ROLE_RADIO_BUTTON: "radio",
  ROLE_TABLE_ROW: "row",
  ROLE_ROW_HEADER: "rowheader",
  ROLE_SCROLL_BAR: "scrollbar",
  ROLE_SEPARATOR: "separator",
  ROLE_SLIDER: "slider",
  ROLE_SPIN_BUTTON: "spinbutton",
  ROLE_STATUSBAR: "status",
  ROLE_SUBSCRIPT: "subscript",
  ROLE_SUGGESTION: "suggestion",
  ROLE_SUPERSCRIPT: "superscript",
  ROLE_PAGE_TAB: "tab",
  ROLE_PAGE_TAB_LIST: "tablist",
  ROLE_SCROLL_PANE: "tabpanel",
  ROLE_DESCRIPTION_TERM: "term",
  ROLE_ENTRY: ["searchbox", "textbox"],
  ROLE_TIMER: "timer",
  ROLE_TOOL_BAR: "toolbar",
  ROLE_TOOL_TIP: "tooltip",
  ROLE_TREE: "tree",
  ROLE_TREE_TABLE: "treegrid",
  ROLE_TREE_ITEM: "treeitem",
  ATK_ROLE_STATIC: "abbr",
  ATK_ROLE_FORM: "form",
};

const atkAttributeNameToWaiAriaMap = {
  activedescendant: "active descendent",
  autocomplete: "",
  colcount: "column count",
  colindex: "column index",
  colindextext: "column index",
  colspan: "column span",
  current: "",
  haspopup: "",
  invalid: "",
  keyshortcuts: "key shortcuts",
  "placeholder-text": "placeholder",
  posinset: "position",
  rowcount: "row count",
  rowindex: "row index",
  rowindextext: "row index",
  rowspan: "row span",
  setsize: "set size",
  sort: "",
  valuemax: "max value",
  valuemin: "min value",
  valuenow: "current value",
  valuetext: "current value",
};

const atkAttributeValueToWaiAriaMap = {
  autocomplete: {
    inline: "autocomplete inlined",
    list: "autocomplete in list",
    both: "autocomplete inlined and in list",
    none: "no autocomplete",
  },
  current: {
    page: "current page",
    step: "current step",
    location: "current location",
    date: "current date",
    time: "current time",
    true: "current item",
    false: "not current item",
  },
  haspopup: {
    true: "has popup menu",
    menu: "has popup menu",
    listbox: "has popup listbox",
    tree: "has popup tree",
    grid: "has popup grid",
    dialog: "has popup dialog",
  },
  invalid: {
    grammar: "grammatical error detected",
    false: "not invalid",
    spelling: "spelling error detected",
    true: "invalid",
  },
  sort: {
    ascending: "sorted in ascending order",
    descending: "sorted in descending order",
    none: "no defined sort order",
    other: "non ascending / descending sort order applied",
  },
};

const attributeIgnoreList = [
  "atomic",
  "container-atomic",
  "braillelabel",
  "brailleroledescription",
  "describedby",
  "description",
  "dropeffect",
  "grabbed",
  "hidden",
  "label",
  "labelledby",
  "live",
  "container-live",
  "container-live-role",
  "owns",
  "relevant",
  "container-relevant",
  "roledescription",
];

const accessibilityTree = window.flattenTreeWithoutIgnores(
  window.document.body,
  window.createAccessibilityTree(window.document.body),
  null
);

function getNodeUnderTest(element) {
  return accessibilityTree.find(({ node }) => node === element);
}

function wrapAssert(assertionCallback) {
  try {
    assertionCallback();
  } catch (error) {
    console.error(error.message);

    throw error;
  }
}

/**
 * Shim of https://github.com/web-platform-tests/wpt/blob/master/wai-aria/scripts/ATTAcomm.js
 */
class ATTAcommShim {
  constructor({ steps, title }) {
    window.test(() => {
      const element = document.getElementById("test");

      for (const step of steps) {
        const { test } = step;
        const assertions = test[ACCESSIBILITY_API] ?? [];

        for (const assertion of assertions) {
          const [matcher, name, equality, expected] = assertion;

          if (matcher === ATK_PROPERTY) {
            const nodeUnderTest = getNodeUnderTest(element);

            switch (name) {
              case ATK_NAME: {
                const actual = nodeUnderTest
                  ? nodeUnderTest.accessibleName ??
                    nodeUnderTest.accessibleValue
                  : "";

                if (equality === "is") {
                  wrapAssert(() => window.assert_equals(actual, expected));
                }

                continue;
              }
              case ATK_DESCRIPTION: {
                const actual = nodeUnderTest
                  ? nodeUnderTest.accessibleDescription
                  : "";

                if (equality === "is") {
                  wrapAssert(() => window.assert_equals(actual, expected));
                }

                continue;
              }
              case ATK_ROLE: {
                const actual = nodeUnderTest ? nodeUnderTest.role : "";

                if (equality === "is") {
                  const mappedExpected = atkRoleToWaiAriaMap[expected];

                  if (!mappedExpected) {
                    console.warn(
                      `Unknown expected role "${expected}", skipping...`
                    );

                    continue;
                  }

                  if (Array.isArray(mappedExpected)) {
                    wrapAssert(() =>
                      window.assert_in_array(actual, mappedExpected)
                    );
                  } else {
                    wrapAssert(() =>
                      window.assert_equals(actual, mappedExpected)
                    );
                  }
                }

                continue;
              }
              case ATK_OBJECT_ATTRIBUTES: {
                const actualRole = nodeUnderTest?.role ?? "";
                const actualAttributeLabels =
                  nodeUnderTest?.accessibleAttributeLabels ?? [];
                const actualValue = nodeUnderTest?.accessibleValue ?? "";

                if (
                  equality === "contains" &&
                  expected.startsWith("xml-roles:")
                ) {
                  const mappedExpected = expected.replace("xml-roles:", "");
                  wrapAssert(() =>
                    window.assert_equals(actualRole, mappedExpected)
                  );
                } else if (equality === "contains") {
                  const [expectedAttribute, expectedValue] =
                    expected.split(":");

                  if (attributeIgnoreList.includes(expectedAttribute)) {
                    console.warn(
                      `Unsupported attribute for testing "${expectedAttribute}", skipping...`
                    );

                    continue;
                  }

                  const mappedExpectedAttribute =
                    atkAttributeNameToWaiAriaMap?.[expectedAttribute] ??
                    expectedAttribute;

                  const mappedExpectedValue =
                    atkAttributeValueToWaiAriaMap?.[expectedAttribute]?.[
                      expectedValue
                    ] ?? expectedValue;

                  if (expectedAttribute === "valuetext") {
                    actualAttributeLabels.push(`current value ${actualValue}`);
                  }

                  wrapAssert(() =>
                    window.assert_true(
                      actualAttributeLabels.some(
                        (label) =>
                          label.includes(mappedExpectedAttribute) &&
                          label.includes(mappedExpectedValue)
                      )
                    )
                  );
                }

                continue;
              }
              default: {
                console.warn(`Unknown property "${name}", skipping...`);

                continue;
              }
            }
          }

          console.warn(`Unknown matcher "${matcher}", skipping...`);

          continue;
        }
      }

      window.done();
    }, title);
  }
}

window.ATTAcomm = ATTAcommShim;
