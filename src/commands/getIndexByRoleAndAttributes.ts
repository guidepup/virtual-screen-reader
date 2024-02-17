import {
  AccessibilityNode,
  END_OF_ROLE_PREFIX,
} from '../createAccessibilityTree.js';
import { matchesAccessibleAttributes, matchesRoles } from './nodeMatchers.js';
import type { AriaAttributes } from './types.js';

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
