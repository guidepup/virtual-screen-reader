import { isElement } from "../isElement";
import { VirtualCommandArgs } from "./types";

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
 * The reading order goes both directions, and a user needs to be aware of the
 * alternate reading order so that they can invoke the functionality.
 *
 * The reading order goes both directions, and a user needs to be able to
 * travel backwards through their chosen reading order.
 *
 * REF: https://a11ysupport.io/tech/aria/aria-flowto_attribute
 */
export function moveToPreviousAlternateReadingOrderElement({
  index = 0,
  container,
  currentIndex,
  tree,
}: MoveToNextAlternateReadingOrderElement) {
  if (!isElement(container)) {
    return;
  }

  // Degree of trust that this isn't called with a current index that can't
  // actually index the tree.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { alternateReadingOrderParents } = tree.at(currentIndex)!;
  const targetNode = alternateReadingOrderParents[index];

  if (!targetNode) {
    return;
  }

  return tree.findIndex(({ node }) => node === targetNode);
}
