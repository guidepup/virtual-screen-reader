import { getAccessibleName } from "./getAccessibleName";
import { getRole } from "./getRole";
import { isElement } from "./isElement";
import { isInaccessible } from "dom-accessibility-api";

export interface AccessibilityNode {
  accessibleName: string;
  node: Node;
  role: string;
}

interface AccessibilityNodeTree extends AccessibilityNode {
  children: AccessibilityNodeTree[];
}

// TODO: This isn't fully compliant, see "Children Presentational" point
// See https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
export function isHiddenFromAccessibilityTree(node: Node) {
  if (node.nodeType === Node.TEXT_NODE && !!node.textContent.trim()) {
    return false;
  }

  return !isElement(node) || isInaccessible(node);
}

function flattenTree(tree: AccessibilityNodeTree): AccessibilityNode[] {
  const { children, ...treeNode } = tree;

  const flattenedTree = [...children.flatMap((child) => flattenTree(child))];

  const isAnnounced = treeNode.accessibleName || treeNode.role;
  const isRoleContainer = !treeNode.accessibleName && treeNode.role;

  if (isAnnounced) {
    flattenedTree.unshift(treeNode);
  }

  if (isRoleContainer) {
    flattenedTree.push({
      accessibleName: "",
      node: treeNode.node,
      role: `end of ${treeNode.role}`,
    });
  }

  return flattenedTree;
}

function growTree(
  node: Node,
  tree: AccessibilityNodeTree
): AccessibilityNodeTree {
  if (tree.accessibleName) {
    return tree;
  }

  node.childNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    const accessibleName = getAccessibleName(childNode);

    tree.children.push(
      growTree(childNode, {
        accessibleName,
        children: [],
        node: childNode,
        role: getRole(childNode, accessibleName),
      })
    );
  });

  return tree;
}

export function createAccessibilityTree(node: Node) {
  if (isHiddenFromAccessibilityTree(node)) {
    return [];
  }

  const accessibleName = getAccessibleName(node);

  const tree = growTree(node, {
    accessibleName,
    children: [],
    node: node,
    role: getRole(node, accessibleName),
  });

  return flattenTree(tree);
}
