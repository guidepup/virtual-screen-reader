import { computeAccessibleDescription } from "dom-accessibility-api";
import { isElement } from "../isElement.js";

export function getAccessibleDescription(node: Node) {
  return isElement(node) ? computeAccessibleDescription(node).trim() : "";
}
