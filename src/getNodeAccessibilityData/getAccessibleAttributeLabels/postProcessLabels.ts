import type { AccessibleAttributeToLabelMap } from ".//index";
import { postProcessAriaValueNow } from "./postProcessAriaValueNow";

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

  if (labels["aria-setsize"]?.value === "-1") {
    /**
     * If the total number of items is unknown, authors SHOULD set the value of
     * aria-setsize to -1.
     *
     * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-setsize
     */
    labels["aria-setsize"].label = "set size unknown";
  }

  return labels;
};
