import { HeadingLevel, VirtualCommandArgs } from "./types";
import { AccessibilityNode } from "../createAccessibilityTree";

export type MoveToNextHeadingLevelNArgs = VirtualCommandArgs;

export function moveToNextHeadingLevelN({ headingLevel }: { headingLevel: HeadingLevel }) {
  const headingElementName = `H${headingLevel}`;
  const isHeadingLevelN =
    (node: AccessibilityNode) => node.node.nodeName === headingElementName;

  return function ({ currentIndex, tree }: MoveToNextHeadingLevelNArgs) {
    const reorderedTree = tree
      .slice(currentIndex + 1)
      .concat(tree.slice(0, currentIndex + 1));

    const accessibilityNode = reorderedTree.find(isHeadingLevelN);

    if (!accessibilityNode) {
      return null;
    }

    return tree.findIndex((node) => node === accessibilityNode);
  };
}
