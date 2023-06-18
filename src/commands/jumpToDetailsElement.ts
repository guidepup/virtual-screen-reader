import { getNextIndexByIdRefsAttribute } from "./getNextIndexByIdRefsAttribute";
import { VirtualCommandArgs } from "./types";

/**
 * aria-details:
 *
 * REF: https://w3c.github.io/aria/#aria-details
 *
 * SHOULD requirement:
 *
 * If the details are not adjacent to the element with aria-details, it might
 * be helpful to jump directly to the reference or have it conveyed.
 *
 * REF: https://a11ysupport.io/tech/aria/aria-details_attribute
 */
export function jumpToDetailsElement({
  container,
  currentIndex,
  tree,
}: VirtualCommandArgs) {
  return getNextIndexByIdRefsAttribute({
    attributeName: "aria-details",
    index: 0,
    container,
    currentIndex,
    tree,
  });
}
