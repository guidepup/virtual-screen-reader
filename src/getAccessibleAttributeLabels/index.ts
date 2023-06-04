import { getAttributesByRole } from "./getAttributesByRole";
import { getLabelFromAriaAttribute } from "./getLabelFromAriaAttribute";
import { getLabelFromHtmlEquivalentAttribute } from "./getLabelFromHtmlEquivalentAttribute";
import { isElement } from "../isElement";
import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

export const getAccessibleAttributeLabels = ({
  node,
  role,
}: {
  node: Node;
  role: string;
}): string[] => {
  const labels = [];

  if (!isElement(node)) {
    return labels;
  }

  const attributes = getAttributesByRole(role);

  attributes.forEach((attributeName) => {
    const labelFromHtmlEquivalentAttribute =
      getLabelFromHtmlEquivalentAttribute({
        attributeName,
        node,
      });

    if (labelFromHtmlEquivalentAttribute) {
      labels.push(labelFromHtmlEquivalentAttribute);

      return;
    }

    const labelFromAriaAttribute = getLabelFromAriaAttribute({
      attributeName,
      node,
    });

    if (labelFromAriaAttribute) {
      labels.push(labelFromAriaAttribute);

      return;
    }

    const labelFromImplicitAriaAttributeValue = mapAttributeNameAndValueToLabel(
      attributeName,
      attributes[attributeName]
    );

    if (labelFromImplicitAriaAttributeValue) {
      labels.push(labelFromImplicitAriaAttributeValue);

      return;
    }
  });

  return labels;
};
