export const getLocalName = (element: Element) =>
  element.localName ?? element.tagName.toLowerCase();
