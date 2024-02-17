import { getElementNode } from './getElementNode.js';
import { getIdRefsByAttribute } from '../getIdRefsByAttribute.js';
import { getNodeByIdRef } from '../getNodeByIdRef.js';
import { isElement } from '../isElement.js';
import { VirtualCommandArgs } from './types.js';

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

  // Degree of trust that this isn't called with a current index that can't
  // actually index the tree.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentAccessibilityNode = tree.at(currentIndex)!;
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
