import { AccessibilityNode } from "../createAccessibilityTree.js";
import { AriaAttributes } from "./types.js";

export function matchesRoles(
  node: AccessibilityNode,
  roles: Readonly<string[]>
) {
  if (!roles?.length) {
    return true;
  }

  return roles.includes(node.role);
}

export function matchesAccessibleAttributes(
  node: AccessibilityNode,
  ariaAttributes: Readonly<AriaAttributes>
) {
  if (!ariaAttributes) {
    return true;
  }

  for (const [name, value] of Object.entries(ariaAttributes)) {
    if (node.accessibleAttributeToLabelMap[name]?.value !== value) {
      return false;
    }
  }

  return true;
}
