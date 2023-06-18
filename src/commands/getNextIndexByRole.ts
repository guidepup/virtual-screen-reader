import { VirtualCommandArgs } from "./types";

export type GetNextIndexByRoleArgs = Omit<VirtualCommandArgs, "container">;

export function getNextIndexByRole(roles: Readonly<string[]>) {
  return function getNextIndex({ currentIndex, tree }: GetNextIndexByRoleArgs) {
    const reorderedTree = tree
      .slice(currentIndex + 1)
      .concat(tree.slice(0, currentIndex + 1));

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
