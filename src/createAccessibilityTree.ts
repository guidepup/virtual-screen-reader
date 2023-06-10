import { getNodeAccessibilityData } from "./getNodeAccessibilityData";
import { HTMLElementWithValue } from "./getNodeAccessibilityData/getAccessibleValue";
import { isElement } from "./isElement";
import { isInaccessible } from "dom-accessibility-api";

export interface AccessibilityNode {
  accessibleAttributeLabels: string[];
  accessibleDescription: string;
  accessibleName: string;
  accessibleValue: string;
  allowedAccessibilityChildRoles: string[][];
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
    accessibleName ===
    (
      node.textContent ||
      `${(node as HTMLElementWithValue).value}` ||
      ""
    )?.trim()
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
      accessibleValue: treeNode.accessibleValue,
      allowedAccessibilityChildRoles: treeNode.allowedAccessibilityChildRoles,
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
      accessibleValue,
      allowedAccessibilityChildRoles,
      childrenPresentational,
      role,
      spokenRole,
    } = getNodeAccessibilityData({
      allowedAccessibilityRoles: tree.allowedAccessibilityChildRoles,
      node: childNode,
      inheritedImplicitPresentational: tree.childrenPresentational,
    });

    tree.children.push(
      growTree(childNode, {
        accessibleAttributeLabels,
        accessibleDescription,
        accessibleName,
        accessibleValue,
        allowedAccessibilityChildRoles,
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
    accessibleValue,
    allowedAccessibilityChildRoles,
    childrenPresentational,
    role,
    spokenRole,
  } = getNodeAccessibilityData({
    allowedAccessibilityRoles: [],
    node,
    inheritedImplicitPresentational: false,
  });

  const tree = growTree(node, {
    accessibleAttributeLabels,
    accessibleDescription,
    accessibleName,
    accessibleValue,
    allowedAccessibilityChildRoles,
    children: [],
    childrenPresentational,
    node,
    role,
    spokenRole,
  });

  return flattenTree(tree);
}
