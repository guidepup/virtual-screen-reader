import { AccessibilityNode } from "../createAccessibilityTree.js";
import { getElementFromNode } from "../getElementFromNode.js";

export function getElementNode(
  accessibilityNode: AccessibilityNode
): HTMLElement {
  const { node } = accessibilityNode;

  return getElementFromNode(node);
}
