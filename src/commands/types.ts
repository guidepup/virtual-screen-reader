import { AccessibilityNode } from "../createAccessibilityTree.js";

export type AriaAttributes = Record<string, string>;

export interface VirtualCommandArgs {
  currentIndex: number;
  container: Node;
  tree: AccessibilityNode[];
}
