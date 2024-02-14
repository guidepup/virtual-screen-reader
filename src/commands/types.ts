import { AccessibilityNode } from "../createAccessibilityTree";

export interface VirtualCommandArgs {
  currentIndex: number;
  container: Node;
  tree: AccessibilityNode[];
}

export type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";
