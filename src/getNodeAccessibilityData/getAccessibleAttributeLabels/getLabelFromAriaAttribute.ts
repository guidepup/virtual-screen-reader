import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

export const getLabelFromAriaAttribute = ({
  attributeName,
  container,
  node,
}: {
  attributeName: string;
  container: Node;
  node: HTMLElement;
}) => {
  const attributeValue = node.getAttribute(attributeName);

  return {
    label: mapAttributeNameAndValueToLabel({
      attributeName,
      attributeValue,
      container,
    }),
    value: attributeValue,
  };
};
