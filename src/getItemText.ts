import { AccessibilityNode } from "./createAccessibilityTree";

export const getItemText = (accessibilityNode: AccessibilityNode) => {
  const { accessibleName, accessibleValue } = accessibilityNode;
  const announcedValue =
    accessibleName === accessibleValue ? "" : accessibleValue;

  return [accessibleName, announcedValue].filter(Boolean).join(", ");
};
