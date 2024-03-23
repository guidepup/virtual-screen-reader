import { isElement } from "./isElement";
import type { Root } from "./Virtual";

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
