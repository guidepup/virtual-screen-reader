import { mapAttributeNameAndValueToLabel } from './mapAttributeNameAndValueToLabel.js';

export const getLabelFromAriaAttribute = ({
  attributeName,
  container,
  node,
}: {
  attributeName: string;
  container: Node;
  node: HTMLElement;
}): { label: string; value: string } => {
  const attributeValue = node.getAttribute(attributeName);

  return {
    label:
      mapAttributeNameAndValueToLabel({
        attributeName,
        attributeValue,
        container,
        node,
      }) ?? "",
    value: attributeValue ?? "",
  };
};
