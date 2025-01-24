import { getLocalName } from "../getLocalName";
import { isElement } from "../isElement";

export type HTMLElementWithValue =
  | HTMLButtonElement
  | HTMLDataElement
  | HTMLInputElement
  | HTMLLIElement
  | HTMLMeterElement
  | HTMLOptionElement
  | HTMLProgressElement
  | HTMLParamElement;

const ignoredInputTypes = new Set(["checkbox", "radio"]);
const allowedLocalNames = new Set([
  "button",
  "data",
  "input",
  // "li",
  "meter",
  "option",
  "progress",
  "param",
]);

function getSelectValue(node: HTMLSelectElement) {
  const selectedOptions = [...node.options].filter(
    (optionElement) => optionElement.selected
  );

  if (node.multiple) {
    return [...selectedOptions]
      .map((optionElement) => getValue(optionElement))
      .join("; ");
  }

  if (selectedOptions.length === 0) {
    return "";
  }

  return getValue(selectedOptions[0]);
}

function getInputValue(node: HTMLInputElement) {
  if (ignoredInputTypes.has(node.type)) {
    return "";
  }

  return getValue(node);
}

function getValue(node: HTMLElementWithValue) {
  const localName = getLocalName(node);

  // TODO: handle use of explicit roles where a value taken from content is
  // expected, e.g. combobox.
  // See core-aam/combobox-value-calculation-manual.html
  if (!allowedLocalNames.has(localName)) {
    return "";
  }

  if (
    node.getAttribute("aria-valuetext") ||
    node.getAttribute("aria-valuenow")
  ) {
    return "";
  }

  return typeof node.value === "number" ? `${node.value}` : node.value;
}

export function getAccessibleValue(node: Node) {
  if (!isElement(node)) {
    return "";
  }

  switch (getLocalName(node)) {
    case "input": {
      return getInputValue(node as HTMLInputElement);
    }
    case "select": {
      return getSelectValue(node as HTMLSelectElement);
    }
  }

  return getValue(node as HTMLElementWithValue);
}
