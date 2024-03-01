import { AccessibilityNodeTree } from "../../createAccessibilityTree.js";

export const getChildrenByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}) => tree.children.filter((child) => child.role === role);
