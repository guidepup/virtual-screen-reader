import { computeAccessibleName } from "dom-accessibility-api";
import { isElement } from "./isElement";

export function getAccessibleName(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.trim();
  }

  if (isElement(node)) {
    return computeAccessibleName(node).trim();
  }

  return "";
}
