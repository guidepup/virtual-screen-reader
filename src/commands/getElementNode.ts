import { AccessibilityNode } from "../createAccessibilityTree";
import { getNearestElement } from "../getNearestElement";

export function getElementNode(accessibilityNode: AccessibilityNode): Element {
  const { node } = accessibilityNode;

  return getNearestElement(node);
}
