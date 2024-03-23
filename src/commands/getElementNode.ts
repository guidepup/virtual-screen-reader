import { AccessibilityNode } from "../createAccessibilityTree";
import { getElementFromNode } from "../getElementFromNode";

export function getElementNode(
  accessibilityNode: AccessibilityNode
): HTMLElement {
  const { node } = accessibilityNode;

  return getElementFromNode(node);
}
