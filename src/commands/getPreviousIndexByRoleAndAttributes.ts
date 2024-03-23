import {
  getIndexByRoleAndAttributes,
  type GetIndexFilters,
} from "./getIndexByRoleAndAttributes";
import type { GetNextIndexArgs } from "./getNextIndexByRoleAndAttributes";

type GetPreviousIndexArgs = GetNextIndexArgs;

export function getPreviousIndexByRoleAndAttributes(
  filters: Readonly<GetIndexFilters>
) {
  return function getPreviousIndexInner({
    currentIndex,
    tree,
  }: GetPreviousIndexArgs) {
    const reorderedTree = tree
      .slice(0, currentIndex)
      .reverse()
      .concat(tree.slice(currentIndex).reverse());

    return getIndexByRoleAndAttributes({ filters, reorderedTree, tree });
  };
}
