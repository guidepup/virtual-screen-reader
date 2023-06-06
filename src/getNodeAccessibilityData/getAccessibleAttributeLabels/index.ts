import { getAttributesByRole } from "./getAttributesByRole";
import { getLabelFromAriaAttribute } from "./getLabelFromAriaAttribute";
import { getLabelFromHtmlEquivalentAttribute } from "./getLabelFromHtmlEquivalentAttribute";
import { getLabelFromImplicitHtmlElementValue } from "./getLabelFromImplicitHtmlElementValue";
import { isElement } from "../../isElement";
import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";

export const getAccessibleAttributeLabels = ({
  accessibleValue,
  node,
  role,
}: {
  accessibleValue: string;
  node: Node;
  role: string;
}): string[] => {
  const labels = [];

  if (!isElement(node)) {
    return labels;
  }

  const attributes = getAttributesByRole({ accessibleValue, role });

  attributes.forEach(([attributeName, implicitAttributeValue]) => {
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

    const labelFromImplicitHtmlElementValue =
      getLabelFromImplicitHtmlElementValue({
        attributeName,
        node,
      });

    if (labelFromImplicitHtmlElementValue) {
      labels.push(labelFromImplicitHtmlElementValue);

      return;
    }

    const labelFromImplicitAriaAttributeValue = mapAttributeNameAndValueToLabel(
      {
        attributeName,
        attributeValue: implicitAttributeValue,
      }
    );

    if (labelFromImplicitAriaAttributeValue) {
      labels.push(labelFromImplicitAriaAttributeValue);

      return;
    }
  });

  return labels;
};
