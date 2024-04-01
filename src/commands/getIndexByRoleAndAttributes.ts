import { matchesAccessibleAttributes, matchesRoles } from "./nodeMatchers";
import { AccessibilityNode } from "../createAccessibilityTree";
import type { AriaAttributes } from "./types";
import { END_OF_ROLE_PREFIX } from "../flattenTree";

export interface GetIndexFilters {
  /** Matches a node only if the node has any of these roles */
  roles?: Readonly<string[]>;

  /** Matches a node only if the node has **all** of these aria attributes */
  ariaAttributes?: Readonly<AriaAttributes>;
}

export function getIndexByRoleAndAttributes({
  filters,
  reorderedTree,
  tree,
}: {
  filters: GetIndexFilters;
  reorderedTree: AccessibilityNode[];
  tree: AccessibilityNode[];
}) {
  const accessibilityNode = reorderedTree.find(
    (node) =>
      !node.spokenRole.startsWith(END_OF_ROLE_PREFIX) &&
      matchesRoles(node, filters.roles) &&
      matchesAccessibleAttributes(node, filters.ariaAttributes)
  );

  if (!accessibilityNode) {
    return null;
  }

  return tree.findIndex((node) => node === accessibilityNode);
}
