import {
  childrenPresentationalRoles,
  getRole,
  presentationRoles,
} from "../getRole";
import { getAccessibleAttributeLabels } from "./getAccessibleAttributeLabels";
import { getAccessibleDescription } from "./getAccessibleDescription";
import { getAccessibleName } from "./getAccessibleName";
import { getAccessibleValue } from "./getAccessibleValue";

export function getNodeAccessibilityData({
  inheritedImplicitPresentational,
  node,
}: {
  inheritedImplicitPresentational: boolean;
  node: Node;
}) {
  const accessibleDescription = getAccessibleDescription(node);
  const accessibleName = getAccessibleName(node);
  const accessibleValue = getAccessibleValue(node);

  const role = getRole({
    accessibleName,
    inheritedImplicitPresentational,
    node,
  });

  const accessibleAttributeLabels = getAccessibleAttributeLabels({
    node,
    role,
  });

  const isPresentational = presentationRoles.includes(role);
  const isGeneric = role === "generic";

  const childrenPresentational =
    inheritedImplicitPresentational ||
    childrenPresentationalRoles.includes(role);

  const spokenRole = isPresentational || isGeneric ? "" : role;
  const amendedAccessibleDescription =
    accessibleDescription === accessibleName ? "" : accessibleDescription;

  return {
    accessibleAttributeLabels,
    accessibleDescription: amendedAccessibleDescription,
    accessibleName,
    accessibleValue,
    childrenPresentational,
    role,
    spokenRole,
  };
}
