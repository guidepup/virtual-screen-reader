import { isElement } from "../isElement";
import { VirtualCommandArgs } from "./types";

export interface JumpToControlledElementCommandArgs extends VirtualCommandArgs {
  index?: number;
}

/**
 * aria-controls:
 *
 * Identifies the element (or elements) whose contents or presence
 * are controlled by the current element. See related aria-owns.
 *
 * REF: https://w3c.github.io/aria/#aria-controls
 *
 * MUST requirement:
 *
 * The controlled element might not be close to the element with
 * aria-controls and the user might find it convenient to jump directly to
 * the controlled element.
 *
 * REF: https://a11ysupport.io/tech/aria/aria-controls_attribute
 */
export function jumpToControlledElement({
  index = 0,
  container,
  currentIndex,
  tree,
}: JumpToControlledElementCommandArgs) {
  if (!isElement(container)) {
    return;
  }

  const currentNode = tree.at(currentIndex)?.node;

  if (!currentNode || !isElement(currentNode)) {
    return;
  }

  const controlledNodesIdRefs = (
    currentNode.getAttribute("aria-controls") ?? ""
  )
    .trim()
    .split(" ")
    .filter(Boolean);

  const controlledNodeId = controlledNodesIdRefs[index];

  if (!controlledNodeId) {
    return;
  }

  const controlledNode = container.querySelector(`#${controlledNodeId}`);

  if (!controlledNode) {
    return;
  }

  const controlledNodeIndex = tree.findIndex(
    ({ node }) => node === controlledNode
  );

  if (controlledNodeIndex !== -1) {
    return controlledNodeIndex;
  }

  const controlledNodeIndexByParent = tree.findIndex(
    ({ parent }) => parent === controlledNode
  );

  if (controlledNodeIndexByParent !== -1) {
    return controlledNodeIndexByParent;
  }

  return;
}
