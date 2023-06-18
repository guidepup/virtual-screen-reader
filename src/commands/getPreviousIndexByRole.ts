import { VirtualCommandArgs } from "./types";

export type GetPreviousIndexByRoleArgs = Omit<VirtualCommandArgs, "container">;

export function getPreviousIndexByRole(roles: Readonly<string[]>) {
  return function getPreviousIndex({
    currentIndex,
    tree,
  }: GetPreviousIndexByRoleArgs) {
    const reorderedTree = tree
      .slice(0, currentIndex)
      .reverse()
      .concat(tree.slice(currentIndex).reverse());

    const accessibilityNode = reorderedTree.find(
      (node) =>
        roles.includes(node.role) && !node.spokenRole.startsWith("end of")
    );

    if (!accessibilityNode) {
      return null;
    }

    return tree.findIndex((node) => node === accessibilityNode);
  };
}
