import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

const isNotMatchingElement = ({ elements, node }) =>
  elements.length && !elements.includes(node.localName);

const isNotMatchingProperties = ({ node, properties }) =>
  properties.length &&
  !properties.some(({ key, value }) => node.getAttribute(key) === value);

// REFs:
// - https://www.w3.org/TR/html-aria/#docconformance-attr
// - https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
const ariaToHTMLAttributeMapping: Record<
  string,
  Array<{
    elements?: string[];
    implicitMissingValue?: string;
    name: string;
    negative?: boolean;
    properties?: { key: string; value: string }[];
    value?: string;
  }>
> = {
  "aria-autocomplete": [
    { elements: ["form"], name: "autocomplete" },
    { elements: ["input", "select", "textarea"], name: "autocomplete" },
  ],
  "aria-checked": [
    {
      elements: ["input"],
      implicitMissingValue: "false",
      name: "checked",
      properties: [
        { key: "type", value: "checkbox" },
        { key: "type", value: "radio" },
      ],
    },
    {
      value: "mixed",
      name: "indeterminate",
    },
  ],
  "aria-colspan": [{ elements: ["td", "th"], name: "colspan" }],
  "aria-controls": [
    {
      elements: ["input"],
      name: "list",
    },
  ],
  "aria-disabled": [
    {
      elements: ["button", "input", "optgroup", "option", "select", "textarea"],
      name: "disabled",
    },
    {
      // TODO: Form controls within a valid legend child element of a fieldset
      // with a disabled attribute do not become disabled.
      elements: ["fieldset"],
      name: "disabled",
    },
  ],

  // TODO: Set properties on the summary element.
  // REF: https://www.w3.org/TR/html-aam-1.0/#att-open-details
  // "aria-expanded": [{ elements: ["details"], name: "open" }],

  // Not announced, indeed it will be hidden from the accessibility tree.
  // "aria-hidden": [{ name: "hidden" }],

  "aria-invalid": [
    // TODO: If the value doesn't match the pattern: aria-invalid="true";
    // Otherwise, aria-invalid="false"
    // REF: https://www.w3.org/TR/html-aam-1.0/#att-pattern
    // { elements: ["input"], name: "pattern" },
    // TODO: aria-invalid="spelling" or grammar
    // REF: https://www.w3.org/TR/html-aam-1.0/#att-spellcheck
    // { elements: ["input"], name: "spellcheck" },
  ],

  "aria-multiselectable": [{ elements: ["select"], name: "multiple" }],
  "aria-placeholder": [
    { elements: ["input", "textarea"], name: "placeholder" },
  ],
  "aria-valuemax": [
    { elements: ["input"], name: "max" },
    { elements: ["meter", "progress"], name: "max" },
  ],
  "aria-valuemin": [
    { elements: ["input"], name: "min" },
    { elements: ["meter", "progress"], name: "min" },
  ],
  "aria-valuenow": [{ elements: ["meter", "progress"], name: "value" }],
  "aria-readonly": [
    { elements: ["input", "textarea"], name: "readonly" },
    { name: "contenteditable", negative: true },
  ],
  "aria-required": [
    { elements: ["input", "select", "textarea"], name: "required" },
  ],
  "aria-rowspan": [{ elements: ["td", "th"], name: "rowspan" }],
  "aria-selected": [{ elements: ["option"], name: "selected" }],
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

  for (const {
    elements = [],
    implicitMissingValue,
    name,
    negative = false,
    properties = [],
    value,
  } of htmlAttribute) {
    if (isNotMatchingElement({ elements, node })) {
      continue;
    }

    if (isNotMatchingProperties({ node, properties })) {
      continue;
    }

    const attributeValue = node.hasAttribute(name)
      ? value ?? node.getAttribute(name)
      : node.hasAttribute(attributeName)
      ? undefined
      : implicitMissingValue;

    const label = mapAttributeNameAndValueToLabel({
      attributeName,
      attributeValue,
      container,
      negative,
      node,
    });

    if (label) {
      return { label, value: attributeValue };
    }
  }

  return { label: "", value: "" };
};
