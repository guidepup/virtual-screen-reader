import type { AccessibilityNodeTree } from "../../../createAccessibilityTree.js";

/**
 * If the DOM ancestry accurately represents the level, the user agent can
 * calculate the level of an item from the document structure. This attribute
 * can be used to provide an explicit indication of the level when that is
 * not possible to calculate from the document structure or the aria-owns
 * attribute. User agent support for automatic calculation of level may vary;
 * authors SHOULD test with user agents and assistive technologies to
 * determine whether this attribute is needed. If the author intends for the
 * user agent to calculate the level, the author SHOULD omit this attribute.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-level
 */
export const getLevelFromDocumentStructure = ({
  level = 1,
  role,
  tree,
}: {
  level?: number;
  role: string;
  tree: AccessibilityNodeTree | null;
}): string => {
  if (!tree) {
    return `${level}`;
  }

  if (tree.role === role) {
    level++;
  }

  const parentTree = tree.parentAccessibilityNodeTree;

  if (!parentTree) {
    return `${level}`;
  }

  return getLevelFromDocumentStructure({
    role,
    tree: parentTree,
    level,
  });
};
