import { getNodeAccessibilityData } from "./getNodeAccessibilityData";
import { isElement } from "./isElement";
import { isInaccessible } from "dom-accessibility-api";

export interface AccessibilityNode {
  accessibleAttributeLabels: string[];
  accessibleDescription: string;
  accessibleName: string;
  childrenPresentational: boolean;
  node: Node;
  role: string;
  spokenRole: string;
}

interface AccessibilityNodeTree extends AccessibilityNode {
  children: AccessibilityNodeTree[];
}

function isHiddenFromAccessibilityTree(node: Node) {
  if (node.nodeType === Node.TEXT_NODE && !!node.textContent.trim()) {
    return false;
  }

  return !isElement(node) || isInaccessible(node);
}

function shouldIgnoreChildren(tree: AccessibilityNodeTree) {
  const { accessibleName, node } = tree;

  if (!accessibleName) {
    return false;
  }

  return (
    // TODO: improve comparison on whether the children are superfluous
    // to include.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessibleName === (node.textContent || (node as any).value)?.trim()
  );
}

function flattenTree(tree: AccessibilityNodeTree): AccessibilityNode[] {
  const { children, ...treeNode } = tree;
  const isAnnounced =
    treeNode.accessibleName ||
    treeNode.accessibleDescription ||
    treeNode.spokenRole;
  const ignoreChildren = shouldIgnoreChildren(tree);

  const flattenedTree = ignoreChildren
    ? []
    : [...children.flatMap((child) => flattenTree(child))];

  const isRoleContainer =
    flattenedTree.length && !ignoreChildren && treeNode.spokenRole;

  if (isAnnounced) {
    flattenedTree.unshift(treeNode);
  }

  if (isRoleContainer) {
    flattenedTree.push({
      accessibleAttributeLabels: treeNode.accessibleAttributeLabels,
      accessibleDescription: treeNode.accessibleDescription,
      accessibleName: treeNode.accessibleName,
      childrenPresentational: treeNode.childrenPresentational,
      node: treeNode.node,
      role: treeNode.role,
      spokenRole: `end of ${treeNode.spokenRole}`,
    });
  }

  return flattenedTree;
}

function growTree(
  node: Node,
  tree: AccessibilityNodeTree
): AccessibilityNodeTree {
  node.childNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    const {
      accessibleAttributeLabels,
      accessibleDescription,
      accessibleName,
      childrenPresentational,
      role,
      spokenRole,
    } = getNodeAccessibilityData({
      node: childNode,
      inheritedImplicitPresentational: tree.childrenPresentational,
    });

    tree.children.push(
      growTree(childNode, {
        accessibleAttributeLabels,
        accessibleDescription,
        accessibleName,
        children: [],
        childrenPresentational,
        node: childNode,
        role,
        spokenRole,
      })
    );
  });

  return tree;
}

export function createAccessibilityTree(node: Node) {
  if (isHiddenFromAccessibilityTree(node)) {
    return [];
  }

  const {
    accessibleAttributeLabels,
    accessibleDescription,
    accessibleName,
    childrenPresentational,
    role,
    spokenRole,
  } = getNodeAccessibilityData({
    node,
    inheritedImplicitPresentational: false,
  });

  const tree = growTree(node, {
    accessibleAttributeLabels,
    accessibleDescription,
    accessibleName,
    children: [],
    childrenPresentational,
    node,
    role,
    spokenRole,
  });

  return flattenTree(tree);
}
