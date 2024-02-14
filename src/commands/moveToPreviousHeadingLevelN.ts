import { HeadingLevel, VirtualCommandArgs } from "./types";
import { AccessibilityNode } from "../createAccessibilityTree";

export type MoveToPreviousHeadingLevelNArgs = VirtualCommandArgs;

export function moveToPreviousHeadingLevelN({ headingLevel }: { headingLevel: HeadingLevel }) {
  const headingElementName = `H${headingLevel}`;
  const isHeadingLevelN =
    (node: AccessibilityNode) =>
      node.node.nodeName === headingElementName
        && !node.spokenRole.startsWith("end of")

  return function ({ currentIndex, tree }: MoveToPreviousHeadingLevelNArgs) {
    const reorderedTree = tree
      .slice(0, currentIndex)
      .reverse()
      .concat(tree.slice(currentIndex).reverse());

    const accessibilityNode = reorderedTree.find(isHeadingLevelN);

    if (!accessibilityNode) {
      return null;
    }

    return tree.findIndex((node) => node === accessibilityNode);
  };
}
