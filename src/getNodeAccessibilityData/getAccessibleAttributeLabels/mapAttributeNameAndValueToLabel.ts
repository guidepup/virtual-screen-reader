enum State {
  BUSY = "busy",
  CHECKED = "checked",
  CURRENT = "current item",
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
  "aria-activedescendant": null, // TODO: decide what to announce here + implement focus logic
  "aria-atomic": null, // Handled by live region logic
  "aria-autocomplete": token({
    inline: "autocomplete inlined",
    list: "autocomplete in list",
    both: "autocomplete inlined and in list",
    none: "no autocomplete",
  }),
  "aria-braillelabel": null, // Currently won't do - not implementing a braille screen reader
  "aria-brailleroledescription": null, // Currently won't do - not implementing a braille screen reader
  "aria-busy": state(State.BUSY),
  "aria-checked": tristate(State.CHECKED, State.PARTIALLY_CHECKED),
  "aria-colcount": integer("column count"),
  "aria-colindex": integer("column index"), // TODO: don't announce if have an aria-colindextext
  "aria-colindextext": string("column index"),
  "aria-colspan": integer("column span"),
  "aria-controls": null, // TODO: decide what to announce here
  "aria-current": token({
    page: "current page",
    step: "current step",
    location: "current location",
    date: "current date",
    time: "current time",
    true: State.CURRENT,
    false: `not ${State.CURRENT}`,
  }),
  "aria-describedby": null, // Handled by accessible description
  "aria-description": null, // Handled by accessible description
  "aria-details": null, // TODO: work out if handled by accessible description or if need logic here
  "aria-disabled": state(State.DISABLED),
  "aria-dropeffect": null, // Deprecated in WAI-ARIA 1.1
  "aria-errormessage": null, // TODO: decide what to announce here
  "aria-expanded": state(State.EXPANDED),
  "aria-flowto": null, // TODO: decide what to announce here + implement focus logic
  "aria-grabbed": null, // Deprecated in WAI-ARIA 1.1
  "aria-haspopup": token({
    false: null, // https://w3c.github.io/aria/#aria-haspopup
    true: "has popup menu",
    menu: "has popup menu",
    listbox: "has popup listbox",
    tree: "has popup tree",
    grid: "has popup grid",
    dialog: "has popup dialog",
  }),
  "aria-hidden": null, // Excluded from accessibility tree
  "aria-invalid": token({
    grammar: "grammatical error detected",
    false: `not ${State.INVALID}`,
    spelling: "spelling error detected",
    true: State.INVALID,
  }),
  "aria-keyshortcuts": string("key shortcuts"),
  "aria-label": null, // Handled by accessible name
  "aria-labelledby": null, // Handled by accessible name
  "aria-level": integer("level"),
  "aria-live": null, // Handled by live region logic
  "aria-modal": state(State.MODAL),
  "aria-multiselectable": state(State.MULTI_SELECTABLE),
  "aria-orientation": token({
    horizontal: "orientated horizontally",
    vertical: "orientated vertically",
  }),
  "aria-owns": null, // TODO: decide what to announce here
  "aria-placeholder": string("placeholder"), // TODO: don't announce if have a value
  "aria-posinset": integer("item set position"),
  "aria-pressed": tristate(State.PRESSED, State.PARTIALLY_PRESSED),
  "aria-readonly": state(State.READ_ONLY),
  "aria-relevant": null, // Handled by live region logic
  "aria-required": state(State.REQUIRED),
  "aria-roledescription": null, // Handled by accessible description
  "aria-rowcount": integer("row count"),
  "aria-rowindex": integer("row index"), // TODO: don't announce if have an aria-colindextext
  "aria-rowindextext": string("row index"),
  "aria-rowspan": integer("row span"),
  "aria-selected": state(State.SELECTED),
  "aria-setsize": integer("item set size"),
  "aria-sort": token({
    ascending: "sorted in ascending order",
    descending: "sorted in descending order",
    none: "no defined sort order",
    other: "non ascending / descending sort order applied",
  }),
  "aria-valuemax": number("max value"),
  "aria-valuemin": number("min value"),
  // TODO: don't announce if have an aria-valuetext
  // TODO: map to percentage as per https://w3c.github.io/aria/#aria-valuenow for certain roles
  "aria-valuenow": number("current value"),
  "aria-valuetext": string("current value"), // TODO: don't announce if have a value?
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

function token(tokenMap: Record<string, string>) {
  return function tokenMapper({ attributeValue }) {
    return tokenMap[attributeValue];
  };
}

function concat(propertyName: string) {
  return function mapper({ attributeValue }) {
    return attributeValue ? `${propertyName} ${attributeValue}` : "";
  };
}

function integer(propertyName: string) {
  return concat(propertyName);
}

function number(propertyName: string) {
  return concat(propertyName);
}

function string(propertyName: string) {
  return concat(propertyName);
}

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
