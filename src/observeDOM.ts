import { isElement } from './isElement.js';

export const observeDOM = (function () {
  const MutationObserver = window.MutationObserver;

  return function observeDOM(
    node: Node,
    onChange: MutationCallback
  ): () => void {
    if (!isElement(node)) {
      return;
    }

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
  };
})();
