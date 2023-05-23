import { getRole as getImplicitRole } from "dom-accessibility-api";
import { getRoles } from "@testing-library/dom";
import { isElement } from "./isElement";
import { roles } from "aria-query";

const ignoredRoles = ["presentation", "none"];

const allowedNonAbstractRoles = roles
  .entries()
  .filter(([, { abstract }]) => !abstract)
  .map(([key]) => key) as string[];

const rolesRequiringName = ["form", "region"];

const globalStatesAndProperties = [
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

function getExplicitRole(node: HTMLElement, accessibleName: string) {
  const rawRoles = node.getAttribute("role")?.trim().split(" ");

  if (!rawRoles?.length) {
    return "";
  }

  // TODO: focus and allowed child element exceptions for
  // https://w3c.github.io/aria/#conflict_resolution_presentation_none
  const filteredRoles = rawRoles
    /**
     * As stated in the Definition of Roles section, it is considered an
     * authoring error to use abstract roles in content.
     * User agents MUST NOT map abstract roles via the standard role mechanism
     * of the accessibility API.
     *
     * https://w3c.github.io/aria/#document-handling_author-errors_roles
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
     * https://w3c.github.io/aria/#document-handling_author-errors_roles
     */
    .filter((role) => !!accessibleName || !rolesRequiringName.includes(role))
    /**
     * If an element has global WAI-ARIA states or properties, user agents MUST
     * ignore the presentation role and instead expose the element's implicit
     * role. However, if an element has only non-global, role-specific WAI-ARIA
     * states or properties, the element MUST NOT be exposed unless the
     * presentational role is inherited and an explicit non-presentational role
     * is applied.
     *
     * https://w3c.github.io/aria/#conflict_resolution_presentation_none
     */
    .filter((role) => {
      if (!ignoredRoles.includes(role)) {
        return true;
      }

      if (hasGlobalStateOrProperty(node) || isFocusable(node)) {
        return false;
      }

      return true;
    });

  return filteredRoles?.[0] ?? "";
}

export function getRole(node: Node, accessibleName: string) {
  if (!isElement(node)) {
    return "";
  }

  const target = node.cloneNode() as HTMLElement;
  const explicitRole = getExplicitRole(target, accessibleName);

  if (explicitRole) {
    target.setAttribute("role", explicitRole);
  } else {
    target.removeAttribute("role");
  }

  let role = getImplicitRole(target) ?? "";

  if (!role) {
    // TODO: decide if we just replace dom-accessibility-api above with
    // @testing-library/dom here rather than doing this fallback
    role = Object.keys(getRoles(target))?.[0] ?? "";
  }

  return ignoredRoles.includes(role) ? "" : role;
}
