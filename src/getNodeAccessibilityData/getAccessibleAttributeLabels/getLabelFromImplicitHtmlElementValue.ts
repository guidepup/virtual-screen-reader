import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

const mapLocalNameToImplicitValue: Record<string, Record<string, string>> = {
  "aria-level": {
    h1: "1",
    h2: "2",
    h3: "3",
    h4: "4",
    h5: "5",
    h6: "6",
  },
};

export const getLabelFromImplicitHtmlElementValue = ({
  attributeName,
  container,
  node,
}: {
  attributeName: string;
  container: Node;
  node: HTMLElement;
}): { label: string; value: string } => {
  const { localName } = node;
  const implicitValue = mapLocalNameToImplicitValue[attributeName]?.[localName];

  return {
    label:
      mapAttributeNameAndValueToLabel({
        attributeName,
        attributeValue: implicitValue,
        container,
        node,
      }) ?? "",
    value: implicitValue ?? "",
  };
};
