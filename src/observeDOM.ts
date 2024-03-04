import { isElement } from "./isElement.js";
import type { Root } from "./Virtual.js";

export function observeDOM(
  root: Root,
  node: Node,
  onChange: MutationCallback
): () => void {
  if (!isElement(node)) {
    return () => {};
  }

  const MutationObserver =
    typeof root !== "undefined" ? root?.MutationObserver : null;

  if (MutationObserver) {
    const mutationObserver = new MutationObserver(onChange);

    mutationObserver.observe(node, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }

  return () => {
    // gracefully fallback to not supporting Accessibility Tree refreshes if
    // the DOM changes.
  };
}
