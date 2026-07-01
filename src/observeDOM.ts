import { isElement } from "./isElement";
import type { Root } from "./Virtual";

const OBSERVE_OPTIONS: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

/**
 * Recursively find all open shadow roots within a node tree.
 */
function collectShadowRoots(node: Node): ShadowRoot[] {
  const roots: ShadowRoot[] = [];

  if (isElement(node) && node.shadowRoot) {
    roots.push(node.shadowRoot);
    node.shadowRoot.querySelectorAll("*").forEach((child) => {
      if (child.shadowRoot) {
        roots.push(...collectShadowRoots(child));
      }
    });
  }

  if (isElement(node)) {
    node.querySelectorAll("*").forEach((child) => {
      if (child.shadowRoot) {
        roots.push(...collectShadowRoots(child));
      }
    });
  }

  return roots;
}

export function observeDOM(
  root: Root | undefined,
  node: Node,
  onChange: MutationCallback
): () => void {
  if (!isElement(node)) {
    return () => {};
  }

  const MutationObserverCtor =
    typeof root !== "undefined" ? root?.MutationObserver : null;

  if (MutationObserverCtor) {
    const observers: MutationObserver[] = [];

    // Observe the main container
    const mainObserver = new MutationObserverCtor(onChange);
    mainObserver.observe(node, OBSERVE_OPTIONS);
    observers.push(mainObserver);

    // Observe all shadow roots within the container
    const shadowRoots = collectShadowRoots(node);

    for (const shadowRoot of shadowRoots) {
      const shadowObserver = new MutationObserverCtor(onChange);
      shadowObserver.observe(shadowRoot, OBSERVE_OPTIONS);
      observers.push(shadowObserver);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }

  return () => {
    // gracefully fallback to not supporting Accessibility Tree refreshes if
    // the DOM changes.
  };
}
