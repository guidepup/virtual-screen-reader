import { computeAccessibleName } from "dom-accessibility-api";
import { isElement } from "../isElement";
import { sanitizeString } from "../sanitizeString";

export function getAccessibleName(node: Node) {
  return isElement(node)
    ? computeAccessibleName(node).trim()
    : sanitizeString(node.textContent);
}
