import type { AccessibilityNodeTree } from "../../../createAccessibilityTree.js";

export const hasTreegridAncestor = (
  tree: AccessibilityNodeTree | null
): boolean => {
  if (!tree) {
    return false;
  }

  if (tree.role === "treegrid") {
    return true;
  }

  if (!tree.parentAccessibilityNodeTree) {
    return false;
  }

  return hasTreegridAncestor(tree.parentAccessibilityNodeTree);
};
