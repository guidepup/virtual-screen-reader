import { computeAccessibleName } from "dom-accessibility-api";
import { isElement } from "../isElement";
import { sanitizeString } from "../sanitizeString";

export function getAccessibleName(node: Node): string {
  // Feature detect AOM support
  if ("computedName" in node) {
    return node.computedName as string;
  }

  return isElement(node)
    ? computeAccessibleName(node).trim()
    : // `node.textContent` is only `null` for `document` and `doctype`.
       
      sanitizeString(node.textContent!);
}
