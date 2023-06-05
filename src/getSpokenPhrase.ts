import { AccessibilityNode } from "./createAccessibilityTree";

export const getSpokenPhrase = (accessibilityNode: AccessibilityNode) => {
  const {
    accessibleAttributeLabels,
    accessibleDescription,
    accessibleName,
    accessibleValue,
    spokenRole,
  } = accessibilityNode;

  const announcedValue =
    accessibleName === accessibleValue ? "" : accessibleValue;

  return [
    spokenRole,
    accessibleName,
    announcedValue,
    accessibleDescription,
    ...accessibleAttributeLabels,
  ]
    .filter(Boolean)
    .join(", ");
};
