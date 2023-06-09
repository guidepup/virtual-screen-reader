import { getAttributesByRole } from "./getAttributesByRole";
import { getLabelFromAriaAttribute } from "./getLabelFromAriaAttribute";
import { getLabelFromHtmlEquivalentAttribute } from "./getLabelFromHtmlEquivalentAttribute";
import { getLabelFromImplicitHtmlElementValue } from "./getLabelFromImplicitHtmlElementValue";
import { isElement } from "../../isElement";
import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel";
import { postProcessLabels } from "./postProcessLabels";

export const getAccessibleAttributeLabels = ({
  accessibleValue,
  node,
  role,
}: {
  accessibleValue: string;
  node: Node;
  role: string;
}): string[] => {
  if (!isElement(node)) {
    return [];
  }

  const labels: Record<string, { label: string; value: string }> = {};
  const attributes = getAttributesByRole({ accessibleValue, role });

  attributes.forEach(([attributeName, implicitAttributeValue]) => {
    const {
      label: labelFromHtmlEquivalentAttribute,
      value: valueFromHtmlEquivalentAttribute,
    } = getLabelFromHtmlEquivalentAttribute({
      attributeName,
      node,
    });

    if (labelFromHtmlEquivalentAttribute) {
      labels[attributeName] = {
        label: labelFromHtmlEquivalentAttribute,
        value: valueFromHtmlEquivalentAttribute,
      };

      return;
    }

    const { label: labelFromAriaAttribute, value: valueFromAriaAttribute } =
      getLabelFromAriaAttribute({
        attributeName,
        node,
      });

    if (labelFromAriaAttribute) {
      labels[attributeName] = {
        label: labelFromAriaAttribute,
        value: valueFromAriaAttribute,
      };

      return;
    }

    const {
      label: labelFromImplicitHtmlElementValue,
      value: valueFromImplicitHtmlElementValue,
    } = getLabelFromImplicitHtmlElementValue({
      attributeName,
      node,
    });

    if (labelFromImplicitHtmlElementValue) {
      labels[attributeName] = {
        label: labelFromImplicitHtmlElementValue,
        value: valueFromImplicitHtmlElementValue,
      };

      return;
    }

    const labelFromImplicitAriaAttributeValue = mapAttributeNameAndValueToLabel(
      {
        attributeName,
        attributeValue: implicitAttributeValue,
      }
    );

    if (labelFromImplicitAriaAttributeValue) {
      labels[attributeName] = {
        label: labelFromImplicitAriaAttributeValue,
        value: implicitAttributeValue,
      };

      return;
    }
  });

  return postProcessLabels({ labels, role });
};
