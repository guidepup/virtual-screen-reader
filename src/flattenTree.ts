import type {
  AccessibilityNode,
  AccessibilityNodeTree,
} from "./createAccessibilityTree";
import { getAccessibleAttributeLabels } from "./getNodeAccessibilityData/getAccessibleAttributeLabels";
import { HTMLElementWithValue } from "./getNodeAccessibilityData/getAccessibleValue";

export const END_OF_ROLE_PREFIX = "end of";

const TEXT_NODE = 3;

function shouldIgnoreChildren(tree: AccessibilityNodeTree) {
  const { accessibleName, children, node } = tree;

  if (!accessibleName) {
    return false;
  }

  if (children.length > 1) {
    return false;
  }

  if (children.every((child) => child.node.nodeType !== TEXT_NODE)) {
    return false;
  }

  return (
    accessibleName ===
    (
      node.textContent ||
      `${(node as HTMLElementWithValue).value}` ||
      ""
    )?.trim()
  );
}

export function flattenTree(
  container: Node,
  tree: AccessibilityNodeTree,
  parentAccessibilityNodeTree: AccessibilityNodeTree | null
): AccessibilityNode[] {
  const { children, ...treeNode } = tree;

  treeNode.parentAccessibilityNodeTree = parentAccessibilityNodeTree;

  const { accessibleAttributeLabels, accessibleAttributeToLabelMap } =
    getAccessibleAttributeLabels({
      ...treeNode,
      container,
    });

  const treeNodeWithAttributeLabels = {
    ...treeNode,
    accessibleAttributeLabels,
    accessibleAttributeToLabelMap,
  };

  const isAnnounced =
    !!treeNodeWithAttributeLabels.accessibleName ||
    !!treeNodeWithAttributeLabels.accessibleDescription ||
    treeNodeWithAttributeLabels.accessibleAttributeLabels.length > 0 ||
    !!treeNodeWithAttributeLabels.spokenRole;

  const ignoreChildren = shouldIgnoreChildren(tree);

  const flattenedTree = ignoreChildren
    ? []
    : [
        ...children.flatMap((child) =>
          flattenTree(container, child, {
            ...treeNodeWithAttributeLabels,
            children,
          })
        ),
      ];

  const isRoleContainer =
    !!flattenedTree.length && !ignoreChildren && !!treeNode.spokenRole;

  if (isAnnounced) {
    flattenedTree.unshift(treeNodeWithAttributeLabels);
  }

  if (isRoleContainer) {
    flattenedTree.push({
      ...treeNodeWithAttributeLabels,
      spokenRole: `${END_OF_ROLE_PREFIX} ${treeNodeWithAttributeLabels.spokenRole}`,
    });
  }

  return flattenedTree;
}
