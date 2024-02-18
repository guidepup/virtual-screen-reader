import { getNextIndexByIdRefsAttribute } from "./getNextIndexByIdRefsAttribute.js";
import { VirtualCommandArgs } from "./types.js";

export interface JumpToControlledElementCommandArgs extends VirtualCommandArgs {
  index?: number;
}

/**
 * aria-controls:
 *
 * Identifies the element (or elements) whose contents or presence
 * are controlled by the current element. See related aria-owns.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-controls
 *
 * MUST requirement:
 *
 * The controlled element might not be close to the element with
 * aria-controls and the user might find it convenient to jump directly to
 * the controlled element.
 *
 * REF: https://a11ysupport.io/tech/aria/aria-controls_attribute
 */
export function jumpToControlledElement({
  index = 0,
  container,
  currentIndex,
  tree,
}: JumpToControlledElementCommandArgs) {
  return getNextIndexByIdRefsAttribute({
    attributeName: "aria-controls",
    index,
    container,
    currentIndex,
    tree,
  });
}
