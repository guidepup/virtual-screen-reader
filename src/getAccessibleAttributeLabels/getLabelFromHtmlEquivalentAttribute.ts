import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

// REF: https://www.w3.org/TR/html-aria/#docconformance-attr
const ariaToHTMLAttributeMapping = {
  "aria-checked": [{ name: "checked" }],
  "aria-disabled": [{ name: "disabled" }],
  // "aria-hidden": [{ name: "hidden" }],
  "aria-placeholder": [{ name: "placeholder" }],
  "aria-valuemax": [{ name: "max" }],
  "aria-valuemin": [{ name: "min" }],
  "aria-readonly": [
    { name: "readonly" },
    { name: "contenteditable", negative: true },
  ],
  "aria-required": [{ name: "required" }],
  "aria-colspan": [{ name: "colspan" }],
  "aria-rowspan": [{ name: "rowspan" }],
};

export const getLabelFromHtmlEquivalentAttribute = ({
  attributeName,
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const htmlAttribute = ariaToHTMLAttributeMapping[attributeName];

  if (!htmlAttribute?.length) {
    return null;
  }

  for (const { name, negative = false } of htmlAttribute) {
    const attributeValue = node.getAttribute(name);
    const label = mapAttributeNameAndValueToLabel(
      attributeName,
      attributeValue,
      negative
    );

    if (label) {
      return label;
    }
  }

  return null;
};
