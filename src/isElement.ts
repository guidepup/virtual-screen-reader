const ELEMENT_NODE = 1;

export function isElement(node: Node): node is HTMLElement {
  return node.nodeType === ELEMENT_NODE;
}
