import {
  childrenPresentationalRoles,
  getRole,
  presentationRoles,
} from "./getRole";
import { getAccessibleDescription } from "./getAccessibleDescription";
import { getAccessibleName } from "./getAccessibleName";

export function getNodeAccessibilityData({
  inheritedImplicitPresentational,
  node,
}: {
  inheritedImplicitPresentational: boolean;
  node: Node;
}) {
  const accessibleDescription = getAccessibleDescription(node);
  const accessibleName = getAccessibleName(node);

  const role = getRole({
    accessibleName,
    inheritedImplicitPresentational,
    node,
  });

  const isPresentational = presentationRoles.includes(role);
  const isGeneric = role === "generic";

  const childrenPresentational =
    inheritedImplicitPresentational ||
    childrenPresentationalRoles.includes(role);

  const amendedRole = isPresentational || isGeneric ? "" : role;
  const amendedAccessibleDescription =
    accessibleDescription === accessibleName ? "" : accessibleDescription;

  return {
    accessibleDescription: amendedAccessibleDescription,
    accessibleName,
    role: amendedRole,
    childrenPresentational,
  };
}
