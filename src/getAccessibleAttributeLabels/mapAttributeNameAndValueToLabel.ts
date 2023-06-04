enum State {
  BUSY = "busy",
  CHECKED = "checked",
  DISABLED = "disabled",
  EXPANDED = "expanded",
  GRABBED = "grabbed",
  // HIDDEN = "hidden",
  INVALID = "invalid",
  PRESSED = "pressed",
  SELECTED = "selected",
}

// https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
const ariaStateToVirtualStateMap = {
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
};

// TODO: this is only doing states atm., need to consider properties.
export const mapAttributeNameAndValueToLabel = (
  attributeName: string,
  attributeValue: string | null
) => {
  if (typeof attributeValue !== "string") {
    return null;
  }

  const stateValue = ariaStateToVirtualStateMap[attributeName];

  if (!stateValue) {
    return null;
  }

  return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
};
