import { getRole as getImplicitRole } from "dom-accessibility-api";
import { getLocalName } from "../getLocalName.js";
import { getRoles } from "@testing-library/dom";
import { isElement } from "../isElement.js";
import { roles } from "aria-query";

export const presentationRoles = ["presentation", "none"];

const allowedNonAbstractRoles = roles
  .entries()
  .filter(([, { abstract }]) => !abstract)
  .map(([key]) => key) as string[];

const rolesRequiringName = ["form", "region"];

export const globalStatesAndProperties = [
  "aria-atomic",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-controls",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-dropeffect",
  "aria-flowto",
  "aria-grabbed",
  "aria-hidden",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-live",
  "aria-owns",
  "aria-relevant",
  "aria-roledescription",
];

const FOCUSABLE_SELECTOR = [
  "input:not([type=hidden]):not([disabled])",
  "button:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[contenteditable=""]',
  '[contenteditable="true"]',
  "a[href]",
  "[tabindex]:not([disabled])",
].join(", ");

function isFocusable(node: HTMLElement) {
  return node.matches(FOCUSABLE_SELECTOR);
}

function hasGlobalStateOrProperty(node: HTMLElement) {
  return globalStatesAndProperties.some((global) => node.hasAttribute(global));
}

function getExplicitRole({
  accessibleName,
  allowedAccessibilityRoles,
  inheritedImplicitPresentational,
  node,
}: {
  accessibleName: string;
  allowedAccessibilityRoles: string[][];
  inheritedImplicitPresentational: boolean;
  node: HTMLElement;
}) {
  const rawRoles = node.getAttribute("role")?.trim().split(" ") ?? [];

  const authorErrorFilteredRoles = rawRoles
    /**
     * As stated in the Definition of Roles section, it is considered an
     * authoring error to use abstract roles in content.
     * User agents MUST NOT map abstract roles via the standard role mechanism
     * of the accessibility API.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
     */
    .filter((role) => allowedNonAbstractRoles.includes(role))
    /**
     * Certain landmark roles require names from authors. In situations where
     * an author has not specified names for these landmarks, it is
     * considered an authoring error. The user agent MUST treat such elements
     * as if no role had been provided. If a valid fallback role had been
     * specified, or if the element had an implicit ARIA role, then user
     * agents would continue to expose that role, instead. Instances of such
     * roles are as follows:
     *
     * - form
     * - region
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
     */
    .filter((role) => !!accessibleName || !rolesRequiringName.includes(role));

  /**
   * If an allowed child element has an explicit non-presentational role, user
   * agents MUST ignore an inherited presentational role and expose the element
   * with its explicit role. If the action of exposing the explicit role causes
   * the accessibility tree to be malformed, the expected results are
   * undefined.
   *
   * See also "Children Presentational: True".
   *
   * REF:
   *
   * - https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
   * - https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
   * - https://www.w3.org/TR/wai-aria-1.2/#mustContain
   */

  const isExplicitAllowedChildElement = allowedAccessibilityRoles.some(
    ([allowedExplicitRole]) =>
      authorErrorFilteredRoles?.[0] === allowedExplicitRole
  );

  if (inheritedImplicitPresentational && !isExplicitAllowedChildElement) {
    authorErrorFilteredRoles.unshift("none");
  }

  if (!authorErrorFilteredRoles?.length) {
    return "";
  }

  const filteredRoles = authorErrorFilteredRoles
    /**
     * If an element is focusable, user agents MUST ignore the
     * presentation/none role and expose the element with its implicit role, in
     * order to ensure that the element is operable.
     *
     * If an element has global WAI-ARIA states or properties, user agents MUST
     * ignore the presentation role and instead expose the element's implicit
     * role. However, if an element has only non-global, role-specific WAI-ARIA
     * states or properties, the element MUST NOT be exposed unless the
     * presentational role is inherited and an explicit non-presentational role
     * is applied.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
     */
    .filter((role) => {
      if (!presentationRoles.includes(role)) {
        return true;
      }

      if (hasGlobalStateOrProperty(node) || isFocusable(node)) {
        return false;
      }

      return true;
    });

  return filteredRoles?.[0] ?? "";
}

export function getRole({
  accessibleName,
  allowedAccessibilityRoles,
  inheritedImplicitPresentational,
  node,
}: {
  accessibleName: string;
  allowedAccessibilityRoles: string[][];
  inheritedImplicitPresentational: boolean;
  node: Node;
}) {
  if (!isElement(node)) {
    return { explicitRole: "", implicitRole: "", role: "" };
  }

  const target = node.cloneNode() as HTMLElement;
  const explicitRole = getExplicitRole({
    accessibleName,
    allowedAccessibilityRoles,
    inheritedImplicitPresentational,
    node: target,
  });

  target.removeAttribute("role");

  let implicitRole = getImplicitRole(target) ?? "";

  if (!implicitRole) {
    // Backwards compatibility for when was using aria-query@5.1.3
    if (getLocalName(target) === "body") {
      implicitRole = "document";
    } else {
      // TODO: remove this fallback post https://github.com/eps1lon/dom-accessibility-api/pull/937
      implicitRole = Object.keys(getRoles(target))?.[0] ?? "";
    }
  }

  if (explicitRole) {
    return { explicitRole, implicitRole, role: explicitRole };
  }

  return {
    explicitRole,
    implicitRole,
    role: implicitRole,
  };
}
