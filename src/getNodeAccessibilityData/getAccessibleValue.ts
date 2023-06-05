import { isElement } from "../isElement";

export function getAccessibleValue(node: Node) {
  return isElement(node) ? node.getAttribute("value") ?? "" : "";
}
