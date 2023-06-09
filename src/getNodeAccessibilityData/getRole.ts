import { getRole as getImplicitRole } from "dom-accessibility-api";
import { getRoles } from "@testing-library/dom";
import { isElement } from "../isElement";
import { roles } from "aria-query";

export const presentationRoles = ["presentation", "none"];

const allowedNonAbstractRoles = roles
  .entries()
  .filter(([, { abstract }]) => !abstract)
  .map(([key]) => key) as string[];

export const childrenPresentationalRoles = roles
  .entries()
  .filter(([, { childrenPresentational }]) => childrenPresentational)
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
  inheritedImplicitPresentational,
  node,
}: {
  accessibleName: string;
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
     * REF: https://w3c.github.io/aria/#document-handling_author-errors_roles
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
     * REF: https://w3c.github.io/aria/#document-handling_author-errors_roles
     */
    .filter((role) => !!accessibleName || !rolesRequiringName.includes(role));

  /**
   * "Children Presentational: True"
   *
   * If an allowed child element has an explicit non-presentational role, user
   * agents MUST ignore an inherited presentational role and expose the element
   * with its explicit role. If the action of exposing the explicit role causes
   * the accessibility tree to be malformed, the expected results are
   * undefined.
   *
   * TODO: we're assuming here that the role is allowed. To know otherwise
   * would require us to either have passed through what roles are allowed for
   * this node from parents, or for us to do a backward pass up through parents
   * from this node (the prior likely nicer). We can use the
   * `requiredOwnedElements` property from the `aria-query` to determine what
   * allowed child roles are from any parent role. Work would also be required
   * to make sure the allowed roles "passed through" presentational or generic
   * layers and also handle complicated cases such as aria-owns (and aria-owns
   * with generics intervening). See https://w3c.github.io/aria/#mustContain.
   *
   * REF:
   *
   * - https://w3c.github.io/aria/#tree_exclusion
   * - https://w3c.github.io/aria/#conflict_resolution_presentation_none
   */
  if (inheritedImplicitPresentational && !authorErrorFilteredRoles.length) {
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
     * REF: https://w3c.github.io/aria/#conflict_resolution_presentation_none
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
  inheritedImplicitPresentational,
  node,
}: {
  accessibleName: string;
  inheritedImplicitPresentational: boolean;
  node: Node;
}) {
  if (!isElement(node)) {
    return "";
  }

  const target = node.cloneNode() as HTMLElement;
  const explicitRole = getExplicitRole({
    accessibleName,
    inheritedImplicitPresentational,
    node: target,
  });

  if (explicitRole) {
    target.setAttribute("role", explicitRole);
  } else {
    target.removeAttribute("role");
  }

  let role = getImplicitRole(target) ?? "";

  if (!role) {
    // TODO: remove this fallback post https://github.com/eps1lon/dom-accessibility-api/pull/937
    role = Object.keys(getRoles(target))?.[0] ?? "";
  }

  return role;
}
