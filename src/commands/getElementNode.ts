import { AccessibilityNode } from "../createAccessibilityTree";
import { getElementFromNode } from "../getElementFromNode";

export function getElementNode(accessibilityNode: AccessibilityNode): Element {
  const { node } = accessibilityNode;

  return getElementFromNode(node);
}
