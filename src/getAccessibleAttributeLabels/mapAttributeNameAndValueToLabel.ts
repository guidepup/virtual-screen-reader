enum State {
  BUSY = "busy",
  CHECKED = "checked",
  DISABLED = "disabled",
  EXPANDED = "expanded",
  INVALID = "invalid",
  MODAL = "modal",
  MULTI_SELECTABLE = "multi-selectable",
  PARTIALLY_CHECKED = "partially checked",
  PARTIALLY_PRESSED = "partially pressed",
  PRESSED = "pressed",
  READ_ONLY = "read only",
  REQUIRED = "required",
  SELECTED = "selected",
}

// https://w3c.github.io/aria/#state_prop_def
const ariaPropertyToVirtualLabelMap = {
  // "aria-activedescendant": null,
  // "aria-atomic": null,
  // "aria-autocomplete": null,
  // "aria-braillelabel": null,
  // "aria-brailleroledescription": null,
  "aria-busy": state(State.BUSY),
  "aria-checked": tristate(State.CHECKED, State.PARTIALLY_CHECKED),
  "aria-colcount": integer("column count"),
  "aria-colindex": integer("column index"),
  // "aria-colindextext": null,
  "aria-colspan": integer("column span"),
  // "aria-controls": null,
  "aria-current": state(State.SELECTED),
  // "aria-describedby": null,
  // "aria-description": null,
  // "aria-details": null,
  "aria-disabled": state(State.DISABLED),
  // "aria-dropeffect": null, // Deprecated in WAI-ARIA 1.1
  // "aria-errormessage": null,
  "aria-expanded": state(State.EXPANDED),
  // "aria-flowto": null,
  "aria-grabbed": null, // Deprecated in WAI-ARIA 1.1
  // "aria-haspopup": null,
  // "aria-hidden": null, // Excluded from accessibility tree
  "aria-invalid": state(State.INVALID),
  // "aria-keyshortcuts": null,
  // "aria-label": null,
  // "aria-labelledby": null,
  "aria-level": integer("level"),
  // "aria-live": null,
  "aria-modal": state(State.MODAL),
  "aria-multiselectable": state(State.MULTI_SELECTABLE),
  // "aria-orientation": null,
  // "aria-owns": null,
  // "aria-placeholder": null,
  // "aria-posinset": null,
  "aria-pressed": tristate(State.PRESSED, State.PARTIALLY_PRESSED),
  "aria-readonly": state(State.READ_ONLY),
  // "aria-relevant": null,
  "aria-required": state(State.REQUIRED),
  // "aria-roledescription": null,
  // "aria-rowcount": null,
  // "aria-rowindex": null,
  // "aria-rowindextext": null,
  // "aria-rowspan": null,
  "aria-selected": state(State.SELECTED),
  // "aria-setsize": null,
  // "aria-sort": null,
  // "aria-valuemax": null,
  // "aria-valuemin": null,
  // "aria-valuenow": null,
  // "aria-valuetext": null,
};

function state(stateValue: State) {
  return function stateMapper({ attributeValue, negative }) {
    if (negative) {
      return attributeValue !== "false" ? `not ${stateValue}` : stateValue;
    }

    return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
  };
}

function tristate(stateValue: State, mixedValue: State) {
  return function stateMapper({ attributeValue }) {
    if (attributeValue === "mixed") {
      return mixedValue;
    }

    return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
  };
}

function integer(propertyName: string) {
  return function stateMapper({ attributeValue }) {
    return `${propertyName} ${attributeValue}`;
  };
}

// TODO: this is only doing states atm., need to consider properties.
export const mapAttributeNameAndValueToLabel = ({
  attributeName,
  attributeValue,
  negative = false,
}: {
  attributeName: string;
  attributeValue: string | null;
  negative?: boolean;
}) => {
  if (typeof attributeValue !== "string") {
    return null;
  }

  const mapper = ariaPropertyToVirtualLabelMap[attributeName];

  return mapper?.({ attributeValue, negative }) ?? null;
};
