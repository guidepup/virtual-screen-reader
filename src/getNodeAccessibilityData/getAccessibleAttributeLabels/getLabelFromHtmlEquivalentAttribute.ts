import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

// REF: https://www.w3.org/TR/html-aria/#docconformance-attr
const ariaToHTMLAttributeMapping: Record<
  string,
  Array<{ name: string; negative?: boolean }>
> = {
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
  container,
  node,
}: {
  attributeName: string;
  container: Node;
  node: HTMLElement;
}) => {
  const htmlAttribute = ariaToHTMLAttributeMapping[attributeName];

  if (!htmlAttribute?.length) {
    return { label: "", value: "" };
  }

  for (const { name, negative = false } of htmlAttribute) {
    const attributeValue = node.getAttribute(name);
    const label = mapAttributeNameAndValueToLabel({
      attributeName,
      attributeValue,
      container,
      negative,
    });

    if (label) {
      return { label, value: attributeValue };
    }
  }

  return { label: "", value: "" };
};
