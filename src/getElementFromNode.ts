import { isElement } from './isElement.js';

export const getElementFromNode = (node: Node): HTMLElement => {
  return isElement(node) ? node : node.parentElement;
};
