import { getRole as getImplicitRole } from "dom-accessibility-api";
import { isElement } from "./isElement";
import { roles } from "aria-query";

const ignoredRoles = ["presentation", "none"];

const allowedNonAbstractRoles = roles
  .entries()
  .filter(([, { abstract }]) => !abstract)
  .map(([key]) => key) as string[];

const rolesRequiringName = ["form", "region"];

function getExplicitRole(node: HTMLElement, accessibleName: string) {
  const rawRole = node.getAttribute("role")?.trim();

  if (!rawRole) {
    return "";
  }

  const filteredRoles = rawRole
    .split(" ")
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
    .filter((role) => !!accessibleName || !rolesRequiringName.includes(role));

  return filteredRoles?.[0] ?? "";
}

// TODO: https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
export function getRole(node: Node, accessibleName: string) {
  if (!isElement(node)) {
    return "";
  }

  const target = node.cloneNode(true) as HTMLElement;
  const explicitRole = getExplicitRole(target, accessibleName);

  if (explicitRole) {
    target.setAttribute("role", explicitRole);
  } else {
    target.removeAttribute("role");
  }

  const role = getImplicitRole(target) ?? "";

  return ignoredRoles.includes(role) ? "" : role;
}
