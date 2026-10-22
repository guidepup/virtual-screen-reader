import { isElement } from "./isElement";
import type { Root } from "./Virtual";

const OBSERVER_CONFIG: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

function observeSubtree(
  observer: MutationObserver,
  node: Node,
  observedNodes: Set<Node>
) {
  if (observedNodes.has(node)) {
    return;
  }

  observer.observe(node, OBSERVER_CONFIG);
  observedNodes.add(node);

  if (isElement(node) && node.shadowRoot) {
    observeSubtree(observer, node.shadowRoot, observedNodes);
  }

  if (
    isElement(node) ||
    node.nodeType === 9 || // DOCUMENT_NODE
    node.nodeType === 11 // DOCUMENT_FRAGMENT_NODE
  ) {
    const root = node as Element | Document | DocumentFragment;

    if (typeof root.querySelectorAll === "function") {
      const descendants = root.querySelectorAll("*");

      for (const el of descendants) {
        if (el.shadowRoot) {
          observeSubtree(observer, el.shadowRoot, observedNodes);
        }
      }
    }
  }
}

export function observeDOM(
  root: Root | undefined,
  node: Node,
  onChange: MutationCallback
): () => void {
  if (!isElement(node)) {
    return () => {};
  }

  const MutationObserver =
    typeof root !== "undefined" ? root?.MutationObserver : null;

  if (MutationObserver) {
    const observedNodes = new Set<Node>();

    const mutationObserver = new MutationObserver(
      (mutations: MutationRecord[], observer: MutationObserver) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((addedNode) => {
              observeSubtree(observer, addedNode, observedNodes);
            });
          }
        }

        onChange(mutations, observer);
      }
    );

    observeSubtree(mutationObserver, node, observedNodes);

    return () => {
      mutationObserver.disconnect();
      observedNodes.clear();
    };
  }

  return () => {
    // gracefully fallback to not supporting Accessibility Tree refreshes if
    // the DOM changes.
  };
}
