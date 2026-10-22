import { isElement } from "./isElement";

function isContainer(
  node: Node
): node is Element | Document | DocumentFragment {
  return (
    isElement(node) ||
    node.nodeType === 9 || // DOCUMENT_NODE
    node.nodeType === 11 // DOCUMENT_FRAGMENT_NODE
  );
}

function findNodeByIdDeep(root: Node, idRef: string): Element | null {
  if (!isContainer(root) || !idRef) {
    return null;
  }

  const escaped = `#${CSS.escape(idRef)}`;

  if (typeof root.querySelector === "function") {
    try {
      const found = root.querySelector(escaped);

      if (found) {
        return found;
      }
    } catch {
      // ignore invalid selector error
    }
  }

  if (isElement(root) && root.id === idRef) {
    return root;
  }

  if (isElement(root) && root.shadowRoot) {
    const found = findNodeByIdDeep(root.shadowRoot, idRef);

    if (found) {
      return found;
    }
  }

  if (typeof root.querySelectorAll === "function") {
    const allDescendants = root.querySelectorAll("*");

    for (const el of allDescendants) {
      if (el.shadowRoot) {
        const found = findNodeByIdDeep(el.shadowRoot, idRef);

        if (found) {
          return found;
        }
      }
    }
  }

  return null;
}

export function getNodeByIdRef({
  container,
  idRef,
}: {
  container: Node;
  idRef: string;
}) {
  return findNodeByIdDeep(container, idRef);
}
