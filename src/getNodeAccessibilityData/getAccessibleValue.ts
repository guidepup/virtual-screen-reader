import { isElement } from "../isElement";

function getSelectValue(node: HTMLSelectElement) {
  const selectedOptions = [...node.options].filter((option) => option.selected);

  if (node.multiple) {
    return [...selectedOptions].map((opt) => opt.value).join("; ");
  }

  if (selectedOptions.length === 0) {
    return "";
  }

  return selectedOptions[0].value;
}

function getInputValue(node: HTMLInputElement) {
  if (["checkbox", "radio"].includes(node.type)) {
    return "";
  }

  return node.value;
}

export function getAccessibleValue(node: Node) {
  if (!isElement(node)) {
    return "";
  }

  switch (node.localName) {
    case "input": {
      return getInputValue(node as HTMLInputElement);
    }
    case "select": {
      return getSelectValue(node as HTMLSelectElement);
    }
  }

  return "";
}
