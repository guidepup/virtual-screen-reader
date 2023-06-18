import { getElementNode } from "./getElementNode";
import { getIdRefsByAttribute } from "../getIdRefsByAttribute";
import { getNodeByIdRef } from "../getNodeByIdRef";
import { isElement } from "../isElement";
import { VirtualCommandArgs } from "./types";

export interface GetNextIndexByIdRefsAttributeArgs extends VirtualCommandArgs {
  attributeName: string;
  index?: number;
}

export function getNextIndexByIdRefsAttribute({
  attributeName,
  index = 0,
  container,
  currentIndex,
  tree,
}: GetNextIndexByIdRefsAttributeArgs) {
  if (!isElement(container)) {
    return;
  }

  const currentAccessibilityNode = tree.at(currentIndex);
  const currentNode = getElementNode(currentAccessibilityNode);

  const idRefs = getIdRefsByAttribute({
    attributeName,
    node: currentNode,
  });

  const idRef = idRefs[index];
  const targetNode = getNodeByIdRef({ container, idRef });

  if (!targetNode) {
    return;
  }

  const nodeIndex = tree.findIndex(({ node }) => node === targetNode);

  if (nodeIndex !== -1) {
    return nodeIndex;
  }

  const nodeIndexByParent = tree.findIndex(
    ({ parent }) => parent === targetNode
  );

  if (nodeIndexByParent !== -1) {
    return nodeIndexByParent;
  }

  return;
}
