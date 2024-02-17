import type { AccessibleAttributeToLabelMap } from './/index.js';
import { postProcessAriaValueNow } from './postProcessAriaValueNow.js';

const priorityReplacementMap: [string, string][] = [
  ["aria-colindextext", "aria-colindex"],
  ["aria-rowindextext", "aria-rowindex"],
  /**
   * If aria-valuetext is specified, assistive technologies SHOULD render that
   * value instead of the value of aria-valuenow.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext
   */
  ["aria-valuetext", "aria-valuenow"],
];

export const postProcessLabels = ({
  labels,
  role,
}: {
  labels: AccessibleAttributeToLabelMap;
  role: string;
}) => {
  for (const [preferred, dropped] of priorityReplacementMap) {
    if (labels[preferred] && labels[dropped]) {
      labels[dropped].value = "";
    }
  }

  if (labels["aria-valuenow"]) {
    labels["aria-valuenow"].label = postProcessAriaValueNow({
      value: labels["aria-valuenow"].value,
      min: labels["aria-valuemin"]?.value,
      max: labels["aria-valuemax"]?.value,
      role,
    });
  }

  return labels;
};
