import { isElement } from "./isElement";
import type { Root } from "./Virtual";

const MUTATION_OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

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

  if (!MutationObserver) {
    return () => {
      // gracefully fallback to not supporting Accessibility Tree refreshes if
      // the DOM changes.
    };
  }

  const observed = new Set<Node>();

  const mutationObserver = new MutationObserver((mutations, observer) => {
    scan();

    onChange(mutations, observer);
  });

  const watch = (target: Node) => {
    if (observed.has(target)) {
      return;
    }

    observed.add(target);

    mutationObserver.observe(target, MUTATION_OBSERVER_OPTIONS);
  };

  /**
   * A `MutationObserver` does not cross shadow boundaries, so observing `node`
   * with `subtree: true` misses everything inside a shadow root - which is where
   * web components render their content, live regions included.
   */
  const scan = () => {
    const queue: Node[] = [node];

    while (queue.length > 0) {
      const current = queue.pop()!;

      watch(current);

      if (isElement(current)) {
        current.querySelectorAll("*").forEach((element) => {
          if (element.shadowRoot) {
            queue.push(element.shadowRoot);
          }
        });
      }
    }
  };

  const elementConstructor =
    root?.document?.defaultView?.Element ?? globalThis.Element;

  const attachShadow = elementConstructor?.prototype?.attachShadow;

  scan();

  if (attachShadow) {
    // A shadow root that is already populated when we start observing it never
    // replays those changes, so shadow roots attached later have to be covered
    // as they are created.
    elementConstructor.prototype.attachShadow = function (init) {
      const shadowRoot = attachShadow.call(this, init);

      watch(shadowRoot);

      return shadowRoot;
    };
  }

  return () => {
    if (attachShadow) {
      elementConstructor.prototype.attachShadow = attachShadow;
    }

    mutationObserver.disconnect();
    observed.clear();
  };
}
