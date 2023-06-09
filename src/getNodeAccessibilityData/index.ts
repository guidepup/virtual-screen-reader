import {
  childrenPresentationalRoles,
  getRole,
  presentationRoles,
} from "./getRole";
import { getAccessibleAttributeLabels } from "./getAccessibleAttributeLabels";
import { getAccessibleDescription } from "./getAccessibleDescription";
import { getAccessibleName } from "./getAccessibleName";
import { getAccessibleValue } from "./getAccessibleValue";
import { isElement } from "../isElement";

const getSpokenRole = ({ isGeneric, isPresentational, node, role }) => {
  if (isPresentational || isGeneric) {
    return "";
  }

  if (isElement(node)) {
    /**
     * Assistive technologies SHOULD use the value of aria-roledescription when
     * presenting the role of an element, but SHOULD NOT change other
     * functionality based on the role of an element that has a value for
     * aria-roledescription. For example, an assistive technology that provides
     * functions for navigating to the next region or button SHOULD allow those
     * functions to navigate to regions and buttons that have an
     * aria-roledescription.
     *
     * REF: https://w3c.github.io/aria/#aria-roledescription
     */
    const roledescription = node.getAttribute("aria-roledescription");

    if (roledescription) {
      return roledescription;
    }
  }

  return role;
};

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
    accessibleValue,
    node,
    role,
  });

  const isPresentational = presentationRoles.includes(role);
  const isGeneric = role === "generic";

  const childrenPresentational =
    inheritedImplicitPresentational ||
    childrenPresentationalRoles.includes(role);

  const spokenRole = getSpokenRole({ isGeneric, isPresentational, node, role });
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
