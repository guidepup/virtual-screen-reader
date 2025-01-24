const percentageBasedValueRoles = new Set(["progressbar", "scrollbar"]);

const isNumberLike = (value: string) => {
  return !isNaN(parseFloat(value));
};

const toNumber = (value: string) => parseFloat(value);
const toPercentageLabel = (value: number | string) => `current value ${value}%`;

/**
 * If aria-valuetext is specified, assistive technologies render that instead
 * of the value of aria-valuenow.
 *
 * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow
 */
export const postProcessAriaValueNow = ({
  max,
  min,
  role,
  value,
}: {
  max: string;
  min: string;
  role: string;
  value: string;
}) => {
  if (!percentageBasedValueRoles.has(role)) {
    return value;
  }

  if (!isNumberLike(value)) {
    return value;
  }

  /**
   * For progressbar elements and scrollbar elements, assistive technologies
   * SHOULD render the value to users as a percent, calculated as a position
   * on the range from aria-valuemin to aria-valuemax if both are defined,
   * otherwise the actual value with a percent indicator. For elements with
   * role slider and spinbutton, assistive technologies SHOULD render the
   * actual value to users.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow
   */

  if (isNumberLike(max) && isNumberLike(min)) {
    const percentage = +(
      ((toNumber(value) - toNumber(min)) / (toNumber(max) - toNumber(min))) *
      100
    ).toFixed(2);

    return toPercentageLabel(percentage);
  }

  return toPercentageLabel(value);
};
