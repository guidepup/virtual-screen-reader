import { getNextIndexByIdRefsAttribute } from './getNextIndexByIdRefsAttribute.js';
import { VirtualCommandArgs } from './types.js';

/**
 * aria-details:
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-details
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
