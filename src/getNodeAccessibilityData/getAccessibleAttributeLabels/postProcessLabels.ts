import { postProcessAriaValueNow } from "./postProcessAriaValueNow";

const priorityReplacementMap: [string, string][] = [
  ["aria-colindextext", "aria-colindex"],
  ["aria-rowindextext", "aria-rowindex"],
  /**
   * If aria-valuetext is specified, assistive technologies SHOULD render that
   * value instead of the value of aria-valuenow.
   *
   * REF: https://w3c.github.io/aria/#aria-valuetext
   */
  ["aria-valuetext", "aria-valuenow"],
];

export const postProcessLabels = ({
  labels,
  role,
}: {
  labels: Record<string, { label: string; value: string }>;
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

  return Object.values(labels).map(({ label }) => label);
};
