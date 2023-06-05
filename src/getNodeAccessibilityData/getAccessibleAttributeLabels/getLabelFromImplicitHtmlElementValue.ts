import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

const mapLocalNameToImplicitValue = {
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
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const { localName } = node;
  const implicitValue = mapLocalNameToImplicitValue[attributeName]?.[localName];

  return mapAttributeNameAndValueToLabel({
    attributeName,
    attributeValue: implicitValue,
  });
};
