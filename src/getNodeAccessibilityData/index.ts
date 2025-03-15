import { ARIARoleDefinition, ARIARoleDefinitionKey, roles } from "aria-query";
import { getRole, presentationRoles, synonymRolesMap } from "./getRole";
import { getAccessibleDescription } from "./getAccessibleDescription";
import { getAccessibleName } from "./getAccessibleName";
import { getAccessibleValue } from "./getAccessibleValue";
import { isElement } from "../isElement";

// TODO: swap out with the html-aria package once it supports `dpub-aam` /
// `dpub-aria` specifications.
const childrenPresentationalRoles = new Set([
  ...(roles
    .entries()
    .filter(([, { childrenPresentational }]) => childrenPresentational)
    .map(([key]) => key) as string[]),
  // TODO: temporary catering to WAI-ARIA 1.3 synonym roles that aria-query
  // doesn't handle.
  ...(Object.entries(synonymRolesMap)
    .map(
      ([from, to]) =>
        [to, roles.get(from as ARIARoleDefinitionKey)] as
          | [ARIARoleDefinitionKey, ARIARoleDefinition]
          | [ARIARoleDefinitionKey, undefined]
    )
    .filter(([, role]) => role?.childrenPresentational)
    .map(([key]) => key) as string[]),
]);

const getSpokenRole = ({
  isGeneric,
  isPresentational,
  node,
  role,
}: {
  isGeneric: boolean;
  isPresentational: boolean;
  node: Node;
  role: string;
}) => {
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
     * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
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

  const amendedAccessibleDescription =
    accessibleDescription === accessibleName ? "" : accessibleDescription;

  const isExplicitPresentational = presentationRoles.has(explicitRole);
  const isPresentational = presentationRoles.has(role);
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
   * REF: https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
   */
  const isChildrenPresentationalRole = childrenPresentationalRoles.has(role);

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
   * REF: https://www.w3.org/TR/wai-aria-1.2/#presentational-role-inheritance
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
    accessibleDescription: amendedAccessibleDescription,
    accessibleName,
    accessibleValue,
    allowedAccessibilityChildRoles,
    childrenPresentational,
    isExplicitPresentational,
    role,
    spokenRole,
  };
}
