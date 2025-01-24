import {
  type AncestorList,
  getRole as getImplicitRole,
  roles,
  type TagName,
  type VirtualElement,
} from "html-aria";
import { roles as backupRoles } from "aria-query";
import { getLocalName } from "../getLocalName";
import { isElement } from "../isElement";

export const presentationRoles = new Set(["presentation", "none"]);

const allowedNonAbstractRoles = new Set([
  ...(Object.entries(roles)
    .filter(([, { type }]) => !type.includes("abstract"))
    .map(([key]) => key) as string[]),
  // TODO: remove once the `html-aria` package supports `dpub-aam` /
  // `dpub-aria` specifications.
  ...(backupRoles
    .entries()
    .filter(([, { abstract }]) => !abstract)
    .map(([key]) => key) as string[]),
]);

const rolesRequiringName = new Set(["form", "region"]);

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

const aliasedRolesMap: Record<string, string> = {
  img: "image",
  presentation: "none",
};

function mapAliasedRoles(role: string) {
  const canonical = aliasedRolesMap[role];

  return canonical ?? role;
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
    .filter((role) => allowedNonAbstractRoles.has(role))
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
    .filter((role) => !!accessibleName || !rolesRequiringName.has(role));

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
      if (!presentationRoles.has(role)) {
        return true;
      }

      if (hasGlobalStateOrProperty(node) || isFocusable(node)) {
        return false;
      }

      return true;
    });

  return filteredRoles?.[0] ?? "";
}

// TODO: upstream update to `html-aria` to support supplying a jsdom element in
// a Node environment. Appears their check for `element instanceof HTMLElement`
// fails the `test/int/nodeEnvironment.int.test.ts` suite.
function virtualizeElement(element: HTMLElement): VirtualElement {
  const tagName = getLocalName(element) as TagName;
  const attributes: Record<string, string | null> = {};

  for (let i = 0; i < element.attributes.length; i++) {
    const { name } = element.attributes[i]!;

    attributes[name] = element.getAttribute(name);
  }

  return { tagName, attributes };
}

const rolesDependentOnHierarchy = new Set([
  "footer",
  "header",
  "li",
  "td",
  "th",
  "tr",
]);
const ignoredAncestors = new Set(["body", "document"]);

// TODO: Thought needed if the `getAncestors()` can limit the number of parents
// it enumerates? Presumably as ancestors only matter for a limited number of
// roles, there might be a ceiling to the amount of nesting that is even valid,
// and therefore put an upper bound on how far to backtrack without having to
// stop at the document level for every single element.
//
// Another thought is that we special case each element so the backtracking can
// exit early if an ancestor with a relevant role has already been found.
//
// Alternatively see if providing an element that is part of a DOM can be
// traversed by the `html-aria` library itself so these concerns are
// centralised.
function getAncestors(node: HTMLElement): AncestorList | undefined {
  if (!rolesDependentOnHierarchy.has(getLocalName(node))) {
    return undefined;
  }

  const ancestors: AncestorList = [];

  let target: HTMLElement | null = node;
  let targetLocalName: string;

  while (true) {
    target = target.parentElement;

    if (!target) {
      break;
    }

    targetLocalName = getLocalName(target);

    if (ignoredAncestors.has(targetLocalName)) {
      break;
    }

    ancestors.push({ tagName: targetLocalName as TagName });
  }

  return ancestors;
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
}): { explicitRole: string; implicitRole: string; role: string } {
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

  // Feature detect AOM support
  // TODO: this isn't quite right, computed role might not be the implicit
  // role, it might be the explicit one as `computedRole` does not
  // distinguish between them.
  if ("computedRole" in node) {
    const role = node.computedRole as string;

    return { explicitRole, implicitRole: role, role };
  }

  target.removeAttribute("role");

  // Backwards compatibility
  const isBodyElement = getLocalName(target) === "body";

  const baseImplicitRole = isBodyElement
    ? "document"
    : getImplicitRole(virtualizeElement(target), {
        ancestors: getAncestors(node),
      }) ?? "";

  const implicitRole = mapAliasedRoles(baseImplicitRole);

  if (explicitRole) {
    return { explicitRole, implicitRole, role: explicitRole };
  }

  return {
    explicitRole,
    implicitRole,
    role: implicitRole,
  };
}
