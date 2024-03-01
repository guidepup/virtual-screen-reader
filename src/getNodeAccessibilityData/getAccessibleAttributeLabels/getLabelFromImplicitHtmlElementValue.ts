import { AccessibilityNodeTree } from "../../createAccessibilityTree.js";
import { getLocalName } from "../../getLocalName.js";
import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel.js";

const headingLocalNameToLevelMap: Record<string, string> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
  h5: "5",
  h6: "6",
};

/**
 * TODO: Support these roles in aria-posinset and aria-setsize implicit
 * calculation and labelling.
 *
 * REF:
 * - https://www.w3.org/TR/wai-aria-1.2/#aria-posinset
 * - https://www.w3.org/TR/wai-aria-1.2/#aria-setsize
 */
const ignoredSetRoles: string[] = [
  "article",
  "comment",
  "menuitem",
  "option",
  "radio",
  "row",
  "tab",
  "menuitemcheckbox",
  "menuitemradio",
  "treeitem",
];

type Mapper = ({
  node,
  parentAccessibilityNodeTree,
  role,
}: {
  node: HTMLElement;
  parentAccessibilityNodeTree: AccessibilityNodeTree;
  role: string;
}) => string;

const getChildrenByRole = ({
  parentAccessibilityNodeTree,
  role,
}: {
  parentAccessibilityNodeTree: AccessibilityNodeTree;
  role: string;
}) =>
  parentAccessibilityNodeTree.children.filter((child) => child.role === role);

const mapHtmlElementAriaToImplicitValue: Record<string, Mapper> = {
  "aria-level": ({ node }) => {
    const localName = getLocalName(node);

    return headingLocalNameToLevelMap[localName];
  },
  /**
   * TODO: support correct group position logic.
   *
   * aria-level, aria-posinset, and aria-setsize are all 1-based. When the
   * property is not present or is "0", it indicates the property is not
   * computed or not supported. If any of these properties are specified by the
   * author as either "0" or a negative number, user agents SHOULD use "1"
   * instead.
   *
   * If aria-level is not provided or inherited for an element of role treeitem
   * or comment, user agents implementing IAccessible2 or ATK/AT-SPI MUST
   * compute it by following the explicit or computed RELATION_NODE_CHILD_OF
   * relations.
   *
   * If aria-posinset and aria-setsize are not provided, user agents MUST
   * compute them as follows:
   *
   * - for role="treeitem" and role="comment", walk the tree backward and
   * forward until the explicit or computed level becomes less than the current
   * item's level. Count items only if they are at the same level as the
   * current item.
   * - Otherwise, if the role supports aria-posinset and aria-setsize, process
   * the parent (DOM parent or parent defined by aria-owns), counting items
   * that have the same role.
   * - Because these value are 1-based, include the current item in the
   * computation. For aria-posinset, include the current item and other group
   * items if they are before the current item in the DOM. For aria-setsize,
   * add to that the number of items in the same group after the current item
   * in the DOM.
   *
   * If the author provides one or more of aria-setsize and aria-posinset, it
   * is the author's responsibility to supply them for all elements in the set.
   * User agent correction of missing values in this case is not defined.
   *
   * REF: https://www.w3.org/TR/core-aam-1.2/#mapping_additional_position
   */
  "aria-posinset": ({ node, parentAccessibilityNodeTree, role }) => {
    if (!parentAccessibilityNodeTree) {
      return "";
    }

    if (ignoredSetRoles.includes(role)) {
      return "";
    }

    const childrenFilteredByRole = getChildrenByRole({
      parentAccessibilityNodeTree,
      role,
    });

    const index = childrenFilteredByRole.findIndex(
      (child) => child.node === node
    );

    if (index === -1) {
      return "";
    }

    return `${index + 1}`;
  },
  "aria-setsize": ({ parentAccessibilityNodeTree, role }) => {
    if (!parentAccessibilityNodeTree) {
      return "";
    }

    if (ignoredSetRoles.includes(role)) {
      return "";
    }

    const childrenFilteredByRole = getChildrenByRole({
      parentAccessibilityNodeTree,
      role,
    });

    return `${childrenFilteredByRole.length}`;
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
  parentAccessibilityNodeTree: AccessibilityNodeTree;
  role: string;
}): { label: string; value: string } => {
  const implicitValue = mapHtmlElementAriaToImplicitValue[attributeName]?.({
    node,
    parentAccessibilityNodeTree,
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
