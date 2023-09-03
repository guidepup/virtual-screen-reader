import { isElement } from "./isElement";

export const getElementFromNode = (node: Node): HTMLElement => {
  return isElement(node) ? node : node.parentElement;
};
