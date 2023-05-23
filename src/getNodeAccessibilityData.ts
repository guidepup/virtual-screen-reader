import { getAccessibleName } from "./getAccessibleName";
import { getRole } from "./getRole";

export function getNodeAccessibilityData(node: Node) {
  const accessibleName = getAccessibleName(node);
  const role = getRole(node, accessibleName);

  return { accessibleName, role };
}
