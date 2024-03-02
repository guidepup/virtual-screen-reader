import type { AccessibilityNodeTree } from "../../../createAccessibilityTree.js";

const getFirstNestedChildrenByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}) =>
  tree.children.flatMap((child) => {
    if (child.role === role) {
      return child;
    }

    return getFirstNestedChildrenByRole({ role, tree: child });
  });

const getSiblingsByRoleAndLevel = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}) => {
  let parentTree = tree;

  while (parentTree.role !== role && parentTree.parentAccessibilityNodeTree) {
    parentTree = parentTree.parentAccessibilityNodeTree;
  }

  return getFirstNestedChildrenByRole({ role, tree: parentTree });
};

const getChildrenByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}) => tree.children.filter((child) => child.role === role);

/**
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
export const getSet = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree[] => {
  if (role === "treeitem") {
    return getSiblingsByRoleAndLevel({ role, tree });
  }

  return getChildrenByRole({
    role,
    tree,
  });
};
