import { AccessibilityNode } from "../createAccessibilityTree";
import type { HeadingLevel } from "./types";

export function matchesRoles(node: AccessibilityNode, roles: Readonly<string[]>) {
  return roles.includes(node.role);
}

export function matchesHeadingLevels(node: AccessibilityNode, headingLevels: Readonly<HeadingLevel[]>) {
  if (node.node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const element = node.node as HTMLElement;

  if (element.ariaLevel) {
    return (headingLevels as string[]).includes(element.ariaLevel);
  }

  return headingLevels.some(
    (headingLevel) => element.nodeName === `H${headingLevel}`
  );
}
