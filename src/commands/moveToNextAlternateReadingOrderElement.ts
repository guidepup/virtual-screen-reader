import { getNextIndexByIdRefsAttribute } from "./getNextIndexByIdRefsAttribute.js";
import { VirtualCommandArgs } from "./types.js";

export interface MoveToNextAlternateReadingOrderElement
  extends VirtualCommandArgs {
  index?: number;
}

/**
 * aria-flowto:
 *
 * However, when aria-flowto is provided with multiple ID
 * references, assistive technologies SHOULD present the referenced
 * elements as path choices.
 *
 * In the case of one or more ID references, user agents or assistive
 * technologies SHOULD give the user the option of navigating to any of the
 * targeted elements. The name of the path can be determined by the name of
 * the target element of the aria-flowto attribute. Accessibility APIs can
 * provide named path relationships.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-flowto
 *
 * MUST requirements:
 *
 * A user needs to understand that the current element flows to another element
 * so that they can invoke the functionality.
 *
 * A user needs to be able to follow the alternate reading order.
 *
 * REF: https://a11ysupport.io/tech/aria/aria-flowto_attribute
 */
export function moveToNextAlternateReadingOrderElement({
  index,
  container,
  currentIndex,
  tree,
}: MoveToNextAlternateReadingOrderElement) {
  return getNextIndexByIdRefsAttribute({
    attributeName: "aria-flowto",
    index,
    container,
    currentIndex,
    tree,
  });
}
