import { getIdRefsByAttribute } from "./getIdRefsByAttribute";
import { getNodeAccessibilityData } from "./getNodeAccessibilityData";
import { getNodeByIdRef } from "./getNodeByIdRef";
import { HTMLElementWithValue } from "./getNodeAccessibilityData/getAccessibleValue";
import { isDialogRole } from "./isDialogRole";
import { isElement } from "./isElement";
import { isInaccessible } from "dom-accessibility-api";

export interface AccessibilityNode {
  accessibleAttributeLabels: string[];
  accessibleDescription: string;
  accessibleName: string;
  accessibleValue: string;
  allowedAccessibilityChildRoles: string[][];
  alternateReadingOrderParents: Node[];
  childrenPresentational: boolean;
  node: Node;
  parent: Node | null;
  parentDialog: Node | null;
  role: string;
  spokenRole: string;
}

interface AccessibilityNodeTree extends AccessibilityNode {
  children: AccessibilityNodeTree[];
}

interface AccessibilityContext {
  alternateReadingOrderMap: Map<Node, Set<Node>>;
  container: Node;
  ownedNodes: Set<Node>;
  visitedNodes: Set<Node>;
}

function addAlternateReadingOrderNodes(
  node: Element,
  alternateReadingOrderMap: Map<Node, Set<Node>>,
  container: Element
) {
  const idRefs = getIdRefsByAttribute({
    attributeName: "aria-flowto",
    node,
  });

  idRefs.forEach((idRef) => {
    const childNode = getNodeByIdRef({ container, idRef });

    if (!childNode) {
      return;
    }

    const currentParentNodes =
      alternateReadingOrderMap.get(childNode) ?? new Set<Node>();

    currentParentNodes.add(node);

    alternateReadingOrderMap.set(childNode, currentParentNodes);
  });
}

function mapAlternateReadingOrder(node: Node) {
  const alternateReadingOrderMap = new Map<Node, Set<Node>>();

  if (!isElement(node)) {
    return alternateReadingOrderMap;
  }

  node
    .querySelectorAll("[aria-flowto]")
    .forEach((parentNode) =>
      addAlternateReadingOrderNodes(parentNode, alternateReadingOrderMap, node)
    );

  return alternateReadingOrderMap;
}

function addOwnedNodes(
  node: Element,
  ownedNodes: Set<Node>,
  container: Element
) {
  const idRefs = getIdRefsByAttribute({
    attributeName: "aria-owns",
    node,
  });

  idRefs.forEach((idRef) => {
    const ownedNode = getNodeByIdRef({ container, idRef });

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

function isHiddenFromAccessibilityTree(node: Node | null): node is null {
  if (!node) {
    return true;
  }

  // `node.textContent` is only `null` for `document` and `doctype`.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (node.nodeType === Node.TEXT_NODE && !!node.textContent!.trim()) {
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
    !!treeNode.accessibleName ||
    !!treeNode.accessibleDescription ||
    treeNode.accessibleAttributeLabels.length > 0 ||
    !!treeNode.spokenRole;

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
      alternateReadingOrderParents: treeNode.alternateReadingOrderParents,
      childrenPresentational: treeNode.childrenPresentational,
      node: treeNode.node,
      parent: treeNode.parent,
      parentDialog: treeNode.parentDialog,
      role: treeNode.role,
      spokenRole: `end of ${treeNode.spokenRole}`,
    });
  }

  return flattenedTree;
}

function growTree(
  node: Node,
  tree: AccessibilityNodeTree,
  {
    alternateReadingOrderMap,
    container,
    ownedNodes,
    visitedNodes,
  }: AccessibilityContext
): AccessibilityNodeTree {
  /**
   * Authors MUST NOT create circular references with aria-owns. In the case of
   * authoring error with aria-owns, the user agent MAY ignore some aria-owns
   * element references in order to build a consistent model of the content.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-owns
   */
  if (visitedNodes.has(node)) {
    return tree;
  }

  visitedNodes.add(node);

  const parentDialog = isDialogRole(tree.role) ? tree.node : tree.parentDialog;

  node.childNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    // REF: https://github.com/w3c/aria/issues/1817#issuecomment-1261602357
    if (ownedNodes.has(childNode)) {
      return;
    }

    const alternateReadingOrderParents = alternateReadingOrderMap.has(childNode)
      ? // `alternateReadingOrderMap.has(childNode)` null guards here.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Array.from(alternateReadingOrderMap.get(childNode)!)
      : [];

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
      alternateReadingOrderParents,
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
          alternateReadingOrderParents,
          children: [],
          childrenPresentational,
          node: childNode,
          parent: node,
          parentDialog,
          role,
          spokenRole,
        },
        { alternateReadingOrderMap, container, ownedNodes, visitedNodes }
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
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-owns
   */
  const ownedChildNodes = getOwnedNodes(node, container);

  ownedChildNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    const alternateReadingOrderParents = alternateReadingOrderMap.has(childNode)
      ? // `alternateReadingOrderMap.has(childNode)` null guards here.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Array.from(alternateReadingOrderMap.get(childNode)!)
      : [];

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
      alternateReadingOrderParents,
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
          alternateReadingOrderParents,
          children: [],
          childrenPresentational,
          node: childNode,
          parent: node,
          parentDialog,
          role,
          spokenRole,
        },
        { alternateReadingOrderMap, container, ownedNodes, visitedNodes }
      )
    );
  });

  return tree;
}

export function createAccessibilityTree(node: Node | null) {
  if (isHiddenFromAccessibilityTree(node)) {
    return [];
  }

  const alternateReadingOrderMap = mapAlternateReadingOrder(node);
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
    alternateReadingOrderParents: [],
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
      alternateReadingOrderParents: [],
      children: [],
      childrenPresentational,
      node,
      parent: null,
      parentDialog: null,
      role,
      spokenRole,
    },
    {
      alternateReadingOrderMap,
      container: node,
      ownedNodes,
      visitedNodes,
    }
  );

  return flattenTree(tree);
}
