import { isElement } from "./isElement";

const DOCUMENT_FRAGMENT_NODE = 11;

function isShadowRoot(node: Node): node is ShadowRoot {
  return node.nodeType === DOCUMENT_FRAGMENT_NODE;
}

/**
 * The element a node belongs to.
 *
 * A mutation target can be a `ShadowRoot` - rendering a component replaces the
 * children of its shadow root - which has no `parentElement`, so for those the
 * element to speak about is the host.
 */
export const getElementFromNode = (node: Node): HTMLElement => {
  if (isElement(node)) {
    return node;
  }

  if (isShadowRoot(node)) {
    return node.host as HTMLElement;
  }

  return node.parentElement!;
};
