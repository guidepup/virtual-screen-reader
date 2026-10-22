const ELEMENT_NODE = 1;

export function isElement(node: Node | null | undefined): node is HTMLElement {
  return !!node && node.nodeType === ELEMENT_NODE;
}
