import { moveToNextIdRefElement } from "./moveToNextIdRefElement";
import { VirtualCommandArgs } from "./types";

export interface JumpToControlledElementCommandArgs extends VirtualCommandArgs {
  index?: number;
}

/**
 * aria-controls:
 *
 * Identifies the element (or elements) whose contents or presence
 * are controlled by the current element. See related aria-owns.
 *
 * REF: https://w3c.github.io/aria/#aria-controls
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
  return moveToNextIdRefElement({
    attributeName: "aria-controls",
    index,
    container,
    currentIndex,
    tree,
  })
}
