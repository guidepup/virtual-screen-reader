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
  parent: Node | null;
  role: string;
  spokenRole: string;
}

interface AccessibilityNodeTree extends AccessibilityNode {
  children: AccessibilityNodeTree[];
}

interface AccessibilityContext {
  container: Node;
  ownedNodes: Set<Node>;
  visitedNodes: Set<Node>;
}

function addOwnedNodes(
  owningNode: Element,
  ownedNodes: Set<Node>,
  container: Element
) {
  const ownedNodesIdRefs = (owningNode.getAttribute("aria-owns") ?? "")
    .trim()
    .split(" ")
    .filter(Boolean);

  ownedNodesIdRefs.forEach((id) => {
    const ownedNode = container.querySelector(`#${id}`);

    if (!!ownedNode && !ownedNodes.has(ownedNode)) {
      ownedNodes.add(ownedNode);
    }
  });
}

function getAllOwnedNodes(node: Node) {
  const ownedNodes = new Set<Node>();

  if (!isElement(node)) {
    return ownedNodes;
  }

  node
    .querySelectorAll("[aria-owns]")
    .forEach((owningNode) => addOwnedNodes(owningNode, ownedNodes, node));

  return ownedNodes;
}

function getOwnedNodes(node: Node, container: Node) {
  const ownedNodes = new Set<Node>();

  if (!isElement(node) || !isElement(container)) {
    return ownedNodes;
  }

  addOwnedNodes(node, ownedNodes, container);

  return ownedNodes;
}

function isHiddenFromAccessibilityTree(node: Node) {
  if (!node) {
    return true;
  }

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
    !!flattenedTree.length && !ignoreChildren && !!treeNode.spokenRole;

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
      parent: treeNode.parent,
      role: treeNode.role,
      spokenRole: `end of ${treeNode.spokenRole}`,
    });
  }

  return flattenedTree;
}

function growTree(
  node: Node,
  tree: AccessibilityNodeTree,
  { container, ownedNodes, visitedNodes }: AccessibilityContext
): AccessibilityNodeTree {
  /**
   * Authors MUST NOT create circular references with aria-owns. In the case of
   * authoring error with aria-owns, the user agent MAY ignore some aria-owns
   * element references in order to build a consistent model of the content.
   *
   * REF: https://w3c.github.io/aria/#aria-owns
   */
  if (visitedNodes.has(node)) {
    return tree;
  }

  visitedNodes.add(node);

  node.childNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    // REF: https://github.com/w3c/aria/issues/1817#issuecomment-1261602357
    if (ownedNodes.has(childNode)) {
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
      container,
      node: childNode,
      inheritedImplicitPresentational: tree.childrenPresentational,
    });

    tree.children.push(
      growTree(
        childNode,
        {
          accessibleAttributeLabels,
          accessibleDescription,
          accessibleName,
          accessibleValue,
          allowedAccessibilityChildRoles,
          children: [],
          childrenPresentational,
          node: childNode,
          parent: node,
          role,
          spokenRole,
        },
        { container, ownedNodes, visitedNodes }
      )
    );
  });

  /**
   * If an element has both aria-owns and DOM children then the order of the
   * child elements with respect to the parent/child relationship is the DOM
   * children first, then the elements referenced in aria-owns. If the author
   * intends that the DOM children are not first, then list the DOM children in
   * aria-owns in the desired order. Authors SHOULD NOT use aria-owns as a
   * replacement for the DOM hierarchy. If the relationship is represented in
   * the DOM, do not use aria-owns.
   *
   * REF: https://w3c.github.io/aria/#aria-owns
   */
  const ownedChildNodes = getOwnedNodes(node, container);

  ownedChildNodes.forEach((childNode) => {
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
      container,
      node: childNode,
      inheritedImplicitPresentational: tree.childrenPresentational,
    });

    tree.children.push(
      growTree(
        childNode,
        {
          accessibleAttributeLabels,
          accessibleDescription,
          accessibleName,
          accessibleValue,
          allowedAccessibilityChildRoles,
          children: [],
          childrenPresentational,
          node: childNode,
          parent: node,
          role,
          spokenRole,
        },
        { container, ownedNodes, visitedNodes }
      )
    );
  });

  return tree;
}

export function createAccessibilityTree(node: Node) {
  if (isHiddenFromAccessibilityTree(node)) {
    return [];
  }

  const ownedNodes = getAllOwnedNodes(node);
  const visitedNodes = new Set<Node>();

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
    container: node,
    node,
    inheritedImplicitPresentational: false,
  });

  const tree = growTree(
    node,
    {
      accessibleAttributeLabels,
      accessibleDescription,
      accessibleName,
      accessibleValue,
      allowedAccessibilityChildRoles,
      children: [],
      childrenPresentational,
      node,
      parent: null,
      role,
      spokenRole,
    },
    {
      container: node,
      ownedNodes,
      visitedNodes,
    }
  );

  return flattenTree(tree);
}
