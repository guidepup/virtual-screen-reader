import { AccessibilityNode } from "./createAccessibilityTree";

// TODO: expose the value (e.g. for input elements) as part of spoken phrase.
export const getSpokenPhrase = (accessibilityNode: AccessibilityNode) => {
  const {
    accessibleAttributeLabels,
    accessibleDescription,
    accessibleName,
    spokenRole,
  } = accessibilityNode;

  return [
    spokenRole,
    accessibleName,
    accessibleDescription,
    ...accessibleAttributeLabels,
  ]
    .filter(Boolean)
    .join(", ");
};
