import { getAttributesByRole } from "./getAttributesByRole.js";
import { getLabelFromAriaAttribute } from "./getLabelFromAriaAttribute.js";
import { getLabelFromHtmlEquivalentAttribute } from "./getLabelFromHtmlEquivalentAttribute.js";
import { getLabelFromImplicitHtmlElementValue } from "./getLabelFromImplicitHtmlElementValue.js";
import { isElement } from "../../isElement.js";
import { mapAttributeNameAndValueToLabel } from "./mapAttributeNameAndValueToLabel.js";
import { postProcessLabels } from "./postProcessLabels.js";

export type AccessibleAttributeToLabelMap = Record<
  string,
  { label: string; value: string }
>;

export const getAccessibleAttributeLabels = ({
  accessibleValue,
  alternateReadingOrderParents,
  container,
  node,
  role,
}: {
  accessibleValue: string;
  alternateReadingOrderParents: Node[];
  container: Node;
  node: Node;
  role: string;
}): {
  accessibleAttributeLabels: string[];
  accessibleAttributeToLabelMap: AccessibleAttributeToLabelMap;
} => {
  if (!isElement(node)) {
    return {
      accessibleAttributeLabels: [],
      accessibleAttributeToLabelMap: {},
    };
  }

  const labels: AccessibleAttributeToLabelMap = {};
  const attributes = getAttributesByRole({ accessibleValue, role });

  attributes.forEach(([attributeName, implicitAttributeValue]) => {
    const {
      label: labelFromHtmlEquivalentAttribute,
      value: valueFromHtmlEquivalentAttribute,
    } = getLabelFromHtmlEquivalentAttribute({
      attributeName,
      container,
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
        container,
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
      container,
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
        container,
        node,
      }
    );

    if (labelFromImplicitAriaAttributeValue) {
      labels[attributeName] = {
        label: labelFromImplicitAriaAttributeValue,
        value: implicitAttributeValue ?? "",
      };

      return;
    }
  });

  const accessibleAttributeToLabelMap = postProcessLabels({ labels, role });
  const accessibleAttributeLabels = Object.values(accessibleAttributeToLabelMap)
    .map(({ label }) => label)
    .filter(Boolean);

  /**
   * aria-flowto MUST requirements:
   *
   * The reading order goes both directions, and a user needs to be aware of the
   * alternate reading order so that they can invoke the functionality.
   *
   * The reading order goes both directions, and a user needs to be able to
   * travel backwards through their chosen reading order.
   *
   * REF: https://a11ysupport.io/tech/aria/aria-flowto_attribute
   */
  if (alternateReadingOrderParents.length > 0) {
    accessibleAttributeLabels.push(
      `${alternateReadingOrderParents.length} previous alternate reading ${
        alternateReadingOrderParents.length === 1 ? "order" : "orders"
      }`
    );
  }

  return { accessibleAttributeLabels, accessibleAttributeToLabelMap };
};
