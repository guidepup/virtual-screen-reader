import { isElement } from "./isElement";

/**
 * Shadow-aware ID lookup: searches the container and all descendant
 * shadow roots for an element with the given ID.
 */
export function getNodeByIdRef({
  container,
  idRef,
}: {
  container: Node;
  idRef: string;
}) {
  if (!isElement(container) || !idRef) {
    return null;
  }

  const selector = `#${CSS.escape(idRef)}`;

  // Try light DOM first
  const result = container.querySelector(selector);

  if (result) {
    return result;
  }

  // Search inside shadow roots
  return findInShadowRoots(container, selector);
}

function findInShadowRoots(
  root: Element,
  selector: string
): Element | null {
  if (root.shadowRoot) {
    const found = root.shadowRoot.querySelector(selector);

    if (found) {
      return found;
    }

    for (const child of root.shadowRoot.querySelectorAll("*")) {
      const result = findInShadowRoots(child, selector);

      if (result) {
        return result;
      }
    }
  }

  for (const child of root.querySelectorAll("*")) {
    if (child.shadowRoot) {
      const result = findInShadowRoots(child, selector);

      if (result) {
        return result;
      }
    }
  }

  return null;
}
