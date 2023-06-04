import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

export const getLabelFromAriaAttribute = ({
  attributeName,
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const attributeValue = node.getAttribute(attributeName);

  return mapAttributeNameAndValueToLabel(attributeName, attributeValue);
};
