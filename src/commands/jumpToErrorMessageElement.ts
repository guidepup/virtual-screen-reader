import { getNextIndexByIdRefsAttribute } from "./getNextIndexByIdRefsAttribute";
import { VirtualCommandArgs } from "./types";

export interface JumpToErrorMessageElementCommandArgs
  extends VirtualCommandArgs {
  index?: number;
}

/**
 * aria-errormessage:
 *
 * REFs:
 * - https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
 * - https://a11ysupport.io/tech/aria/aria-errormessage_attribute
 */
export function jumpToErrorMessageElement({
  index = 0,
  container,
  currentIndex,
  tree,
}: JumpToErrorMessageElementCommandArgs) {
  return getNextIndexByIdRefsAttribute({
    attributeName: "aria-errormessage",
    index,
    container,
    currentIndex,
    tree,
  });
}
