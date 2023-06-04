import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

// REF: https://www.w3.org/TR/html-aria/#docconformance-attr
const ariaToHTMLAttributeMapping = {
  "aria-checked": "checked",
  "aria-disabled": "disabled",
  // "aria-hidden": "hidden",
  "aria-placeholder": "placeholder",
  "aria-valuemax": "max",
  "aria-valuemin": "min",
  // TODO: contenteditable
  "aria-readonly": "readonly",
  "aria-required": "required",
  "aria-colspan": "colspan",
  "aria-rowspan": "rowspan",
};

export const getLabelFromHtmlEquivalentAttribute = ({
  attributeName,
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const htmlAttributeName = ariaToHTMLAttributeMapping[attributeName];

  if (!htmlAttributeName) {
    return null;
  }

  const attributeValue = node.getAttribute(htmlAttributeName);

  return mapAttributeNameAndValueToLabel(attributeName, attributeValue);
};
