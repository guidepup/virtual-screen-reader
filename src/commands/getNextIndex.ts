import { matchesHeadingLevels, matchesRoles } from "./nodeMatchers";
import { type HeadingLevel, VirtualCommandArgs } from "./types";

export type GetNextIndexArgs = Omit<VirtualCommandArgs, "container">;

export interface GetNextIndexFilters {
  /** Matches a node only if the node has any of these roles */
  roles?: Readonly<string[]>;

  /** Matches a node only if the node has any of these heading levels */
  headingLevels?: Readonly<HeadingLevel[]>;
}

export function getNextIndex(filters: Readonly<GetNextIndexFilters>) {
  return function ({ currentIndex, tree }: GetNextIndexArgs) {
    const reorderedTree = tree
      .slice(currentIndex + 1)
      .concat(tree.slice(0, currentIndex + 1));

    const accessibilityNode = reorderedTree.find(
      (node) =>
        !node.spokenRole.startsWith("end of")
        && (!filters?.roles || matchesRoles(node, filters.roles))
        && (!filters?.headingLevels || matchesHeadingLevels(node, filters.headingLevels))
    );

    if (!accessibilityNode) {
      return null;
    }

    return tree.findIndex((node) => node === accessibilityNode);
  };
}
