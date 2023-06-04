import { computeAccessibleName } from "dom-accessibility-api";
import { isElement } from "./isElement";

export function getAccessibleName(node: Node) {
  if (isElement(node)) {
    return computeAccessibleName(node).trim();
  }

  return node.textContent.trim();
}
