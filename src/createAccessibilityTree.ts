import { AccessibleAttributeToLabelMap } from "./getNodeAccessibilityData/getAccessibleAttributeLabels/index";
import { getIdRefsByAttribute } from "./getIdRefsByAttribute";
import { getNodeAccessibilityData } from "./getNodeAccessibilityData/index";
import { getNodeByIdRef } from "./getNodeByIdRef";
import { isDialogRole } from "./isDialogRole";
import { isElement } from "./isElement";
import { isHiddenFromAccessibilityTree } from "./isHiddenFromAccessibilityTree";

export interface AccessibilityNode {
  accessibleAttributeLabels: string[];
  accessibleAttributeToLabelMap: AccessibleAttributeToLabelMap;
  accessibleDescription: string;
  accessibleName: string;
  accessibleValue: string;
  allowedAccessibilityChildRoles: string[];
  alternateReadingOrderParents: Node[];
  childrenPresentational: boolean;
  isInert: boolean;
  node: Node;
  parentAccessibilityNodeTree: AccessibilityNodeTree | null;
  parent: Node | null;
  parentDialog: HTMLElement | null;
  role: string;
  spokenRole: string;
}

export interface AccessibilityNodeTree
  extends Omit<
    AccessibilityNode,
    "accessibleAttributeLabels" | "accessibleAttributeToLabelMap"
  > {
  children: AccessibilityNodeTree[];
}

interface AccessibilityContext {
  alternateReadingOrderMap: Map<Node, Set<Node>>;
  container: Node;
  ownedNodes: Set<Node>;
  visitedNodes: Set<Node>;
}

/**
 * Returns the child nodes to traverse for building the flattened
 * accessibility tree, handling shadow DOM and slot projection:
 *
 * 1. If the node has an open shadow root → return shadow root's children
 * 2. If the node is a <slot> → return assigned nodes (or default content)
 * 3. Otherwise → return the node's direct children
 */
function getAccessibleChildNodes(node: Node): Node[] {
  // Shadow host: traverse into the shadow tree
  if (isElement(node) && node.shadowRoot) {
    return Array.from(node.shadowRoot.childNodes);
  }

  // Slot element: traverse assigned (projected) content, or default content
  if (isElement(node) && node.localName === "slot") {
    const slot = node as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true });

    if (assigned.length > 0) {
      return assigned;
    }

    // No assigned content — fall through to default slot content (childNodes)
  }

  return Array.from(node.childNodes);
}

/**
 * Shadow-aware querySelectorAll: searches the node and all descendant
 * shadow roots for elements matching the selector.
 */
function deepQuerySelectorAll(
  node: Node,
  selector: string
): Element[] {
  if (!isElement(node)) {
    return [];
  }

  const results: Element[] = Array.from(node.querySelectorAll(selector));

  // Also search inside shadow roots
  const searchShadowRoots = (root: Element) => {
    if (root.shadowRoot) {
      results.push(
        ...Array.from(root.shadowRoot.querySelectorAll(selector))
      );
      root.shadowRoot.querySelectorAll("*").forEach(searchShadowRoots);
    }
  };

  // Search the node itself and all its descendants
  searchShadowRoots(node);
  node.querySelectorAll("*").forEach(searchShadowRoots);

  return results;
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

  deepQuerySelectorAll(node, "[aria-flowto]").forEach((parentNode) =>
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

  deepQuerySelectorAll(node, "[aria-owns]").forEach((owningNode) =>
    addOwnedNodes(owningNode, ownedNodes, node)
  );

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

function growTree(
  node: Node,
  tree: Omit<
    AccessibilityNodeTree,
    "accessibleAttributeLabels" | "accessibleAttributeToLabelMap"
  >,
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

  const parentDialog = isDialogRole(tree.role)
    ? (tree.node as HTMLElement)
    : tree.parentDialog;

  if (parentDialog) {
    tree.parentDialog = parentDialog;
  }

  /**
   * Determine which child nodes to traverse based on the flattened tree:
   *
   * - If the node has an open shadow root, traverse the shadow tree instead
   *   of the light DOM children (shadow DOM replaces light DOM in the
   *   accessibility tree).
   * - If a child is a <slot>, traverse its assigned nodes (the projected
   *   light DOM content). If no nodes are assigned, fall back to the slot's
   *   default content (its own childNodes).
   * - Otherwise, traverse the node's direct childNodes (standard light DOM).
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#accessibility_tree
   * REF: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedNodes
   */
  const childNodes = getAccessibleChildNodes(node);

  childNodes.forEach((childNode) => {
    if (isHiddenFromAccessibilityTree(childNode)) {
      return;
    }

    // REF: https://github.com/w3c/aria/issues/1817#issuecomment-1261602357
    if (ownedNodes.has(childNode)) {
      return;
    }

    const alternateReadingOrderParents = alternateReadingOrderMap.has(childNode)
      ? // `alternateReadingOrderMap.has(childNode)` null guards here.

        Array.from(alternateReadingOrderMap.get(childNode)!)
      : [];

    const {
      accessibleDescription,
      accessibleName,
      accessibleValue,
      allowedAccessibilityChildRoles,
      childrenPresentational,
      isExplicitPresentational,
      isInert,
      role,
      spokenRole,
    } = getNodeAccessibilityData({
      allowedAccessibilityRoles: tree.allowedAccessibilityChildRoles,
      inheritedImplicitInert: tree.isInert,
      inheritedImplicitPresentational: tree.childrenPresentational,
      node: childNode,
    });

    const childTree = growTree(
      childNode,
      {
        accessibleDescription,
        accessibleName,
        accessibleValue,
        allowedAccessibilityChildRoles,
        alternateReadingOrderParents,
        children: [],
        childrenPresentational,
        isInert,
        node: childNode,
        parentAccessibilityNodeTree: null, // Added during flattening
        parent: node,
        parentDialog,
        role,
        spokenRole,
      },
      { alternateReadingOrderMap, container, ownedNodes, visitedNodes }
    );

    if (isExplicitPresentational) {
      tree.children.push(...childTree.children);
    } else {
      tree.children.push(childTree);
    }
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

        Array.from(alternateReadingOrderMap.get(childNode)!)
      : [];

    const {
      accessibleDescription,
      accessibleName,
      accessibleValue,
      allowedAccessibilityChildRoles,
      childrenPresentational,
      isInert,
      isExplicitPresentational,
      role,
      spokenRole,
    } = getNodeAccessibilityData({
      allowedAccessibilityRoles: tree.allowedAccessibilityChildRoles,
      inheritedImplicitInert: tree.isInert,
      inheritedImplicitPresentational: tree.childrenPresentational,
      node: childNode,
    });

    const childTree = growTree(
      childNode,
      {
        accessibleDescription,
        accessibleName,
        accessibleValue,
        allowedAccessibilityChildRoles,
        alternateReadingOrderParents,
        children: [],
        childrenPresentational,
        isInert,
        node: childNode,
        parentAccessibilityNodeTree: null, // Added during flattening
        parent: node,
        parentDialog,
        role,
        spokenRole,
      },
      { alternateReadingOrderMap, container, ownedNodes, visitedNodes }
    );

    if (isExplicitPresentational) {
      tree.children.push(...childTree.children);
    } else {
      tree.children.push(childTree);
    }
  });

  return tree;
}

export function createAccessibilityTree(
  node: Node | null
): AccessibilityNodeTree | null {
  if (isHiddenFromAccessibilityTree(node)) {
    return null;
  }

  const alternateReadingOrderMap = mapAlternateReadingOrder(node);
  const ownedNodes = getAllOwnedNodes(node);
  const visitedNodes = new Set<Node>();

  const {
    accessibleDescription,
    accessibleName,
    accessibleValue,
    allowedAccessibilityChildRoles,
    childrenPresentational,
    isInert,
    role,
    spokenRole,
  } = getNodeAccessibilityData({
    allowedAccessibilityRoles: [],
    node,
    inheritedImplicitPresentational: false,
    inheritedImplicitInert: false,
  });

  const tree = growTree(
    node,
    {
      accessibleDescription,
      accessibleName,
      accessibleValue,
      allowedAccessibilityChildRoles,
      alternateReadingOrderParents: [],
      children: [],
      childrenPresentational,
      isInert,
      node,
      parentAccessibilityNodeTree: null,
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

  return tree;
}
