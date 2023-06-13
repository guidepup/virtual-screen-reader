import { AccessibilityNode } from "../createAccessibilityTree";

export interface VirtualCommandArgs {
  currentIndex: number;
  container: Node;
  tree: AccessibilityNode[];
}
