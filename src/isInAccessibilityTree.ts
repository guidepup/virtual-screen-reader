import { getAccessibleName } from "./getAccessibleName";
import { getRole } from "./getRole";
import { isInaccessible } from "@testing-library/dom";

// TODO: This isn't particularly compliant
// See https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
export function isInAccessibilityTree(element: Element) {
  if (isInaccessible(element)) {
    return false;
  }

  const isEmptyPresentationElement =
    !getRole(element) && !getAccessibleName(element as HTMLElement);

  if (isEmptyPresentationElement) {
    return false;
  }

  return true;
}
