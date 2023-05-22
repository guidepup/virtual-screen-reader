import { getNodeText } from "@testing-library/dom";

export function getAccessibleName(element: HTMLElement) {
  // TODO: we should be following rules for getting the accessible name
  // See https://www.w3.org/TR/accname-1.2/#mapping_additional_nd_te
  return getNodeText(element).trim();
}
