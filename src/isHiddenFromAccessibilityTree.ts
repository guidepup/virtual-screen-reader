import { getLocalName } from "./getLocalName";
import { isElement } from "./isElement";

const TEXT_NODE = 3;

/**
 * The content of a closed `<details>` element, other than its summary, is
 * rendered with `content-visibility: hidden`, so its contents are skipped and
 * must not be accessible to user-agent features (similar to `display: none`).
 *
 * REF:
 * - https://html.spec.whatwg.org/multipage/rendering.html#the-details-and-summary-elements
 * - https://www.w3.org/TR/css-contain-2/#content-visibility
 */
function isInClosedDetailsContent(node: Node) {
  const parent = node.parentElement;

  if (
    !parent ||
    getLocalName(parent) !== "details" ||
    parent.hasAttribute("open")
  ) {
    return false;
  }

  // REF: https://html.spec.whatwg.org/multipage/interactive-elements.html#summary-for-its-parent-details
  const summaryForParentDetails = Array.from(parent.children).find(
    (child) => getLocalName(child) === "summary"
  );

  return node !== summaryForParentDetails;
}

export function isHiddenFromAccessibilityTree(node: Node | null): node is null {
  if (!node) {
    return true;
  }

  // `node.textContent` is only `null` for `document` and `doctype`.

  if (isInClosedDetailsContent(node)) {
    return true;
  }

  if (node.nodeType === TEXT_NODE && node.textContent!.trim()) {
    return false;
  }

  if (!isElement(node)) {
    return true;
  }

  try {
    if (node.hidden === true) {
      return true;
    }

    if (node.getAttribute("aria-hidden") === "true") {
      return true;
    }

    const getComputedStyle = node.ownerDocument.defaultView?.getComputedStyle;
    const computedStyle = getComputedStyle?.(node);

    if (
      computedStyle?.visibility === "hidden" ||
      computedStyle?.display === "none"
    ) {
      return true;
    }
  } catch {
    // Some elements aren't supported by DOM implementations such as JSDOM.
    // E.g. `<math>`, see https://github.com/jsdom/jsdom/issues/3515
    // We ignore these nodes at the moment as we can't support them.
    return true;
  }

  return false;
}
