import { isElement } from "./isElement";

export const getElementFromNode = (node: Node): HTMLElement => {
  return isElement(node)
    ? node
    : (node.parentElement ??
        (((node.parentNode as (Node & { host?: HTMLElement }) | null)
          ?.host as HTMLElement) ||
          (node.parentElement as HTMLElement)));
};
