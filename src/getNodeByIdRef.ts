import { isElement } from "./isElement.js";

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

  return container.querySelector(`#${CSS.escape(idRef)}`);
}
