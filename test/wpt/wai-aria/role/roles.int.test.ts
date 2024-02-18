import { virtual } from "../../../../src/index.js";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/wai-aria/role/roles.html
 *
 * Tests simple role assignment: <div role="alert">x</div>
 *
 * - Nested role structures (table>row>cell, etc) and Abstract roles (e.g.
 *   widget, composite) are commented with pointers to a separate test file.
 *
 * - ARIA extension specs (e.g. doc-*, graphics-*) are commented with pointers
 *   to a separate spec directory.
 */

/**
 * https://www.w3.org/TR/wai-aria-1.2/#namefromcontent
 */
function allowsNameFromContent(node: Element): boolean {
  return [
    "button",
    "cell",
    "checkbox",
    "columnheader",
    "gridcell",
    "heading",
    "label",
    "legend",
    "link",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "row",
    "rowheader",
    "switch",
    "tab",
    "tooltip",
    "treeitem",
  ].includes(node.getAttribute("role") ?? "");
}

function defaultAriaAttributes(role) {
  switch (role) {
    case "combobox": {
      return ", not expanded, has popup listbox";
    }
    case "heading": {
      return ", level 2";
    }
    case "meter": {
      return ", max value 100, min value 0";
    }
    case "scrollbar": {
      return ", orientated vertically, max value 100, min value 0";
    }
    case "separator": {
      return ", orientated horizontally, max value 100, min value 0";
    }
    case "slider": {
      return ", orientated horizontally, max value 100, min value 0";
    }
    case "spinbutton": {
      return ", 0";
    }
    case "toolbar": {
      return ", orientated horizontally";
    }
  }

  return "";
}

describe("Simple Core ARIA Role Verification Tests", () => {
  test.each([
    "alert",
    "alertdialog",
    "application",
    "article",
    // "associationlist" [AT-RISK: ARIA #1662] or possibly -> ./list-roles.html
    // "associationlistitemkey" [AT-RISK: ARIA #1662] or possibly -> ./list-roles.html
    // "associationlistitemvalue" [AT-RISK: ARIA #1662] or possibly -> ./list-roles.html
    "banner",
    "blockquote",
    "button",
    "caption",
    // "cell" -> ./grid-roles.html
    "checkbox",
    "code",
    // "columnheader" -> ./grid-roles.html
    "combobox",
    // "command" -> ./abstract-roles.html
    // "comment" -> [AT-RISK: ARIA #1885]
    "complementary",
    // "composite" -> ./abstract-roles.html
    "contentinfo",
    "definition",
    "deletion",
    "dialog",
    // "directory" -> FAIL. WONTFIX. Deprecated in ARIA 1.2; re-mapped to list role.
    "document",
    // doc-* roles -> TBD /dpub-aria or /dpub-aam
    "emphasis",
    "feed",
    "figure",
    // form -> ./form-roles.html
    // "generic", -> FAIL. WONTFIX. Screen Readers don't announce the generic role.
    // graphics-* roles -> /graphics-aria
    // "grid" -> ./grid-roles.html
    // "gridcell" -> ./grid-roles.html
    "group",
    "heading",
    // "image" -> ./synonym-roles.html
    // "img" -> ./synonym-roles.html
    // "input" -> ./abstract-roles.html
    "insertion",
    // "landmark" -> ./abstract-roles.html
    "link",
    // "list" -> ./list-roles.html
    // "listitem" -> ./list-roles.html
    // "listitemkey" [See: ARIA #1662] or possibly -> ./list-roles.html
    // "listitemvalue" [See: ARIA #1662] or possibly -> ./list-roles.html
    // "listbox" -> ./listbox-roles.html
    "log",
    "main",
    "marquee",
    "math",
    // "menu" -> ./menu-roles.html
    // "menuitem" -> ./menu-roles.html
    // "menuitemcheckbox" -> ./menu-roles.html
    // "menuitemradio" -> ./menu-roles.html
    // "menubar" -> ./menu-roles.html
    "meter",
    "navigation",
    // "none" -> ./synonym-roles.html
    "note",
    // "option" -> ./listbox-roles.html
    "paragraph",
    // "presentation" -> ./synonym-roles.html
    "progressbar",
    "radio",
    "radiogroup",
    // "range" -> ./abstract-roles.html
    // "region" -> ./region-roles.html
    // "roletype" -> ./abstract-roles.html
    // "row" -> ./grid-roles.html
    // "rowgroup" -> ./grid-roles.html
    // "rowheader" -> ./grid-roles.html
    "scrollbar",
    "search",
    "searchbox",
    // "section" -> ./abstract-roles.html
    // "sectionhead" -> ./abstract-roles.html
    // "select" -> ./abstract-roles.html
    "separator",
    "slider",
    "spinbutton",
    "status",
    "strong",
    // "structure" -> ./abstract-roles.html
    "subscript",
    /**
     * Will be part of WAI-ARIA 1.3, which is still being drafted.
     * REF: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/suggestion_role
     */
    // "suggestion",
    "superscript",
    "switch",
    // "tab" -> ./tab-roles.html
    // "table" -> ./grid-roles.html
    // "tablist" -> ./tab-roles.html
    // "tabpanel" -> ./tab-roles.html
    "term",
    "textbox",
    "time",
    "timer",
    "toolbar",
    "tooltip",
    // "tree" -> ./tree-roles.html
    // "treeitem" -> ./tree-roles.html
    // "treegrid" -> ./treegrid-roles.html
    // "widget" -> ./abstract-roles.html
    // "window" -> ./abstract-roles.html
  ])("%s", async (role) => {
    const container = document.createElement("div");
    container.appendChild(document.createTextNode("x"));
    container.setAttribute("role", role);
    container.id = `role_${role}`;

    await virtual.start({ container });

    expect(await virtual.lastSpokenPhrase()).toEqual(
      `${role}${
        allowsNameFromContent(container) ? ", x" : ""
      }${defaultAriaAttributes(role)}`
    );

    await virtual.stop();
  });
});
