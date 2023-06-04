enum State {
  /**
   * States
   */
  BUSY = "busy",
  CHECKED = "checked",
  DISABLED = "disabled",
  EXPANDED = "expanded",
  GRABBED = "grabbed",
  // HIDDEN = "hidden",
  INVALID = "invalid",
  PRESSED = "pressed",
  SELECTED = "selected",
  /**
   * Properties with state like qualities
   */
  READ_ONLY = "read only",
}

// https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
const ariaStateToVirtualStateMap = {
  /**
   * States
   */
  "aria-busy": State.BUSY,
  "aria-checked": State.CHECKED,
  "aria-current": State.SELECTED,
  "aria-disabled": State.DISABLED,
  "aria-expanded": State.EXPANDED,
  "aria-grabbed": State.GRABBED,
  // "aria-hidden": State.HIDDEN,
  "aria-invalid": State.INVALID,
  "aria-pressed": State.PRESSED,
  "aria-selected": State.SELECTED,
  /**
   * Properties with state like qualities
   */
  "aria-readonly": State.READ_ONLY,
};

// TODO: this is only doing states atm., need to consider properties.
export const mapAttributeNameAndValueToLabel = (
  attributeName: string,
  attributeValue: string | null,
  negative = false
) => {
  if (typeof attributeValue !== "string") {
    return null;
  }

  const stateValue = ariaStateToVirtualStateMap[attributeName];

  if (stateValue) {
    if (negative) {
      return attributeValue !== "false" ? `not ${stateValue}` : stateValue;
    }

    return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
  }

  return null;
};
