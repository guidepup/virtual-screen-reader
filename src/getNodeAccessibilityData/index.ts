import { ARIARoleDefinitionKey, roles } from "aria-query";
import { getRole, presentationRoles } from "./getRole";
import { getAccessibleAttributeLabels } from "./getAccessibleAttributeLabels";
import { getAccessibleDescription } from "./getAccessibleDescription";
import { getAccessibleName } from "./getAccessibleName";
import { getAccessibleValue } from "./getAccessibleValue";
import { isElement } from "../isElement";

const childrenPresentationalRoles = roles
  .entries()
  .filter(([, { childrenPresentational }]) => childrenPresentational)
  .map(([key]) => key) as string[];

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
  allowedAccessibilityRoles,
  alternateReadingOrderParents,
  container,
  inheritedImplicitPresentational,
  node,
}: {
  allowedAccessibilityRoles: string[][];
  alternateReadingOrderParents: Node[];
  container: Node;
  inheritedImplicitPresentational: boolean;
  node: Node;
}) {
  const accessibleDescription = getAccessibleDescription(node);
  const accessibleName = getAccessibleName(node);
  const accessibleValue = getAccessibleValue(node);

  const { explicitRole, implicitRole, role } = getRole({
    accessibleName,
    allowedAccessibilityRoles,
    inheritedImplicitPresentational,
    node,
  });

  const accessibleAttributeLabels = getAccessibleAttributeLabels({
    accessibleValue,
    alternateReadingOrderParents,
    container,
    node,
    role,
  });

  const amendedAccessibleDescription =
    accessibleDescription === accessibleName ? "" : accessibleDescription;

  const isExplicitPresentational = presentationRoles.includes(explicitRole);
  const isPresentational = presentationRoles.includes(role);
  const isGeneric = role === "generic";

  const spokenRole = getSpokenRole({
    isGeneric,
    isPresentational,
    node,
    role,
  });

  const { requiredOwnedElements: allowedAccessibilityChildRoles } = (roles.get(
    role as ARIARoleDefinitionKey
  ) as unknown as {
    requiredOwnedElements: string[][];
  }) ?? { requiredOwnedElements: [] };

  const { requiredOwnedElements: implicitAllowedAccessibilityChildRoles } =
    (roles.get(implicitRole as ARIARoleDefinitionKey) as unknown as {
      requiredOwnedElements: string[][];
    }) ?? { requiredOwnedElements: [] };

  /**
   * Any descendants of elements that have the characteristic "Children
   * Presentational: True" unless the descendant is not allowed to be
   * presentational because it meets one of the conditions for exception
   * described in Presentational Roles Conflict Resolution. However, the text
   * content of any excluded descendants is included.
   *
   * REF: https://w3c.github.io/aria/#tree_exclusion
   */
  const isChildrenPresentationalRole =
    childrenPresentationalRoles.includes(role);

  /**
   * When an explicit or inherited role of presentation is applied to an
   * element with the implicit semantic of a WAI-ARIA role that has Allowed
   * Accessibility Child Roles, in addition to the element with the explicit
   * role of presentation, the user agent MUST apply an inherited role of
   * presentation to any owned elements that do not have an explicit role
   * defined. Also, when an explicit or inherited role of presentation is
   * applied to a host language element which has specifically allowed children
   * as defined by the host language specification, in addition to the element
   * with the explicit role of presentation, the user agent MUST apply an
   * inherited role of presentation to any specifically allowed children that
   * do not have an explicit role defined.
   *
   * REF: https://w3c.github.io/aria/#presentational-role-inheritance
   */
  const isExplicitOrInheritedPresentation =
    isExplicitPresentational || inheritedImplicitPresentational;
  const isElementWithImplicitAllowedAccessibilityChildRoles =
    !!implicitAllowedAccessibilityChildRoles.length;
  const childrenInheritPresentationExceptAllowedRoles =
    isExplicitOrInheritedPresentation &&
    isElementWithImplicitAllowedAccessibilityChildRoles;

  const childrenPresentational =
    isChildrenPresentationalRole ||
    childrenInheritPresentationExceptAllowedRoles;

  return {
    accessibleAttributeLabels,
    accessibleDescription: amendedAccessibleDescription,
    accessibleName,
    accessibleValue,
    allowedAccessibilityChildRoles,
    childrenPresentational,
    role,
    spokenRole,
  };
}
