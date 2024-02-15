import type { GetNextIndexArgs, GetNextIndexFilters } from "./getNextIndex";
import { matchesHeadingLevels, matchesRoles } from "./nodeMatchers";

type GetPreviousIndexArgs = GetNextIndexArgs;
interface GetPreviousIndexFilters extends GetNextIndexFilters {}

export function getPreviousIndex(filters: Readonly<GetPreviousIndexFilters>) {
  return function ({ currentIndex, tree }: GetPreviousIndexArgs) {
    const reorderedTree = tree
      .slice(0, currentIndex)
      .reverse()
      .concat(tree.slice(currentIndex).reverse());

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
