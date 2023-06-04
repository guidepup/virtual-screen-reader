enum State {
  AUTOCOMPLETE = "has auto complete",
  BUSY = "busy",
  CHECKABLE = "checkable",
  CHECKED = "checked",
  CLICKABLE = "clickable",
  COLLAPSED = "collapsed",
  DISABLED = "disabled",
  DRAGGABLE = "draggable",
  DRAGGING = "dragging",
  DROP_TARGET = "drop target",
  EDITABLE = "editable",
  EXPANDED = "expanded",
  FOCUSABLE = "focusable",
  FOCUSED = "focused",
  HAS_POPUP = "has popup",
  HAS_POPUP_DIALOG = "opens dialog",
  HAS_POPUP_GRID = "opens grid",
  HAS_POPUP_LIST = "opens list",
  HAS_POPUP_TREE = "opens tree",
  INVALID_ENTRY = "invalid entry",
  LINKED = "linked",
  MODAL = "modal",
  MULTILINE = "multi line",
  ON = "on",
  PRESSED = "pressed",
  READONLY = "read only",
  REQUIRED = "required",
  SELECTABLE = "selectable",
  SELECTED = "selected",
  VISITED = "visited",
}

const ignoreNegativeState = Symbol("ignoreNegativeState");

const negativeStateLabel = {
  [State.DROP_TARGET]: "done dragging",
  [State.ON]: "off",
  [State.AUTOCOMPLETE]: ignoreNegativeState,
  [State.CHECKABLE]: ignoreNegativeState,
  [State.CLICKABLE]: ignoreNegativeState,
  [State.DRAGGING]: ignoreNegativeState,
  [State.DISABLED]: ignoreNegativeState,
  [State.FOCUSABLE]: ignoreNegativeState,
  [State.FOCUSED]: ignoreNegativeState,
  [State.HAS_POPUP]: ignoreNegativeState,
  [State.HAS_POPUP_DIALOG]: ignoreNegativeState,
  [State.HAS_POPUP_GRID]: ignoreNegativeState,
  [State.HAS_POPUP_LIST]: ignoreNegativeState,
  [State.HAS_POPUP_TREE]: ignoreNegativeState,
  [State.INVALID_ENTRY]: ignoreNegativeState,
  [State.LINKED]: ignoreNegativeState,
  [State.MODAL]: ignoreNegativeState,
  [State.MULTILINE]: ignoreNegativeState,
  [State.READONLY]: ignoreNegativeState,
  [State.SELECTABLE]: ignoreNegativeState,
  [State.VISITED]: ignoreNegativeState,
};

// https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
const ariaStateToVirtualStateMap = {
  "aria-busy": State.BUSY,
  "aria-checked": State.CHECKED,
  "aria-current": State.SELECTED,
  "aria-disabled": State.DISABLED,
  "aria-expanded": State.EXPANDED,
  "aria-grabbed": State.DRAGGING,
  // "aria-hidden": null,
  "aria-invalid": State.INVALID_ENTRY,
  "aria-pressed": State.PRESSED,
  "aria-selected": State.SELECTED,
};

// TODO: this is only doing states atm., need to consider properties.
export const mapAttributeNameAndValueToLabel = (
  attributeName: string,
  attributeValue: string | null
) => {
  const stateValue = ariaStateToVirtualStateMap[attributeName];

  if (!stateValue || typeof attributeValue !== "string") {
    return null;
  }

  if (typeof attributeValue === "string" && attributeValue !== "false") {
    return stateValue;
  }

  const negativeStateValue = negativeStateLabel[stateValue];

  if (negativeStateValue === ignoreNegativeState) {
    return null;
  }

  return negativeStateValue ?? `not ${stateValue}`;
};
