import type { AccessibilityNodeTree } from "../../../createAccessibilityTree";
import { getLevelFromDocumentStructure } from "./getLevelFromDocumentStructure";
import { getLocalName } from "../../../getLocalName";
import { getSet } from "./getSet";
import { hasTreegridAncestor } from "./hasTreegridAncestor";
import { mapAttributeNameAndValueToLabel } from "../mapAttributeNameAndValueToLabel";

const headingLocalNameToLevelMap: Record<string, string> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
  h5: "5",
  h6: "6",
};

type Mapper = ({
  node,
  tree,
  role,
}: {
  node: HTMLElement;
  tree: AccessibilityNodeTree | null;
  role: string;
}) => string;

const mapHtmlElementAriaToImplicitValue: Record<string, Mapper> = {
  /**
   * Used in Roles:
   *
   * - heading
   * - listitem
   * - row
   *
   * Inherits into Roles:
   *
   * - treeitem
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-level
   */
  "aria-level": ({ role, tree, node }) => {
    if (role === "heading") {
      const localName = getLocalName(node);

      return headingLocalNameToLevelMap[localName];
    }

    /**
     * While the row role can be used in a table, grid, or treegrid, the semantics
     * of aria-expanded, aria-posinset, aria-setsize, and aria-level are only
     * applicable to the hierarchical structure of an interactive tree grid.
     * Therefore, authors MUST NOT apply aria-expanded, aria-posinset,
     * aria-setsize, and aria-level to a row that descends from a table or grid,
     * and user agents SHOULD NOT expose any of these four properties to assistive
     * technologies unless the row descends from a treegrid.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#row
     */
    if (role === "row" && hasTreegridAncestor(tree)) {
      return getLevelFromDocumentStructure({
        role,
        tree,
      });
    }

    if (["listitem", "treeitem"].includes(role)) {
      return getLevelFromDocumentStructure({
        role,
        tree,
      });
    }

    return "";
  },
  /**
   * Used in Roles:
   *
   * - article
   * - listitem
   * - menuitem
   * - option
   * - radio
   * - row
   * - tab
   *
   * Inherits into Roles:
   *
   * - menuitemcheckbox
   * - menuitemradio
   * - treeitem
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-posinset
   */
  "aria-posinset": ({ node, tree, role }) => {
    if (!tree) {
      return "";
    }

    /**
     * When an article is in the context of a feed, the author MAY specify
     * values for aria-posinset and aria-setsize.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#article
     *
     * This is interpreted as the author being allowed to specify a value when
     * nested in a feed, but there are no requirements in the specifications
     * for an article role to expose an implicit value, even within a feed.
     */
    if (role === "article") {
      return "";
    }

    /**
     * While the row role can be used in a table, grid, or treegrid, the semantics
     * of aria-expanded, aria-posinset, aria-setsize, and aria-level are only
     * applicable to the hierarchical structure of an interactive tree grid.
     * Therefore, authors MUST NOT apply aria-expanded, aria-posinset,
     * aria-setsize, and aria-level to a row that descends from a table or grid,
     * and user agents SHOULD NOT expose any of these four properties to assistive
     * technologies unless the row descends from a treegrid.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#row
     */
    if (role === "row" && !hasTreegridAncestor(tree)) {
      return "";
    }

    const nodeSet = getSet({
      role,
      tree,
    });
    const index = nodeSet.findIndex((child) => child.node === node);

    return `${index + 1}`;
  },
  /**
   * Used in Roles:
   *
   * - article
   * - listitem
   * - menuitem
   * - option
   * - radio
   * - row
   * - tab
   *
   * Inherits into Roles:
   *
   * - menuitemcheckbox
   * - menuitemradio
   * - treeitem
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-setsize
   */
  "aria-setsize": ({ tree, role }) => {
    if (!tree) {
      return "";
    }

    /**
     * When an article is in the context of a feed, the author MAY specify
     * values for aria-posinset and aria-setsize.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#article
     *
     * This is interpreted as the author being allowed to specify a value when
     * nested in a feed, but there are no requirements in the specifications
     * for an article role to expose an implicit value, even within a feed.
     */
    if (role === "article") {
      return "";
    }

    /**
     * While the row role can be used in a table, grid, or treegrid, the semantics
     * of aria-expanded, aria-posinset, aria-setsize, and aria-level are only
     * applicable to the hierarchical structure of an interactive tree grid.
     * Therefore, authors MUST NOT apply aria-expanded, aria-posinset,
     * aria-setsize, and aria-level to a row that descends from a table or grid,
     * and user agents SHOULD NOT expose any of these four properties to assistive
     * technologies unless the row descends from a treegrid.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#row
     */
    if (role === "row" && !hasTreegridAncestor(tree)) {
      return "";
    }

    const nodeSet = getSet({
      role,
      tree,
    });

    return `${nodeSet.length}`;
  },
};

export const getLabelFromImplicitHtmlElementValue = ({
  attributeName,
  container,
  node,
  parentAccessibilityNodeTree,
  role,
}: {
  attributeName: string;
  container: Node;
  node: HTMLElement;
  parentAccessibilityNodeTree: AccessibilityNodeTree | null;
  role: string;
}): { label: string; value: string } => {
  const implicitValue = mapHtmlElementAriaToImplicitValue[attributeName]?.({
    node,
    tree: parentAccessibilityNodeTree,
    role,
  });

  return {
    label:
      mapAttributeNameAndValueToLabel({
        attributeName,
        attributeValue: implicitValue,
        container,
        node,
      }) ?? "",
    value: implicitValue ?? "",
  };
};
