import { ARIARoleDefinitionKey, roles } from "aria-query";
import { AccessibilityNode } from "./createAccessibilityTree";
import { globalStatesAndProperties } from "./getRole";
import { isElement } from "./isElement";

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

// REF: https://www.w3.org/TR/html-aria/#docconformance-attr
const ariaToHTMLAttributeMapping = {
  "aria-checked": "checked",
  "aria-disabled": "disabled",
  // "aria-hidden": "hidden",
  "aria-placeholder": "placeholder",
  "aria-valuemax": "max",
  "aria-valuemin": "min",
  // TODO: contenteditable
  "aria-readonly": "readonly",
  "aria-required": "required",
  "aria-colspan": "colspan",
  "aria-rowspan": "rowspan",
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
const mapAttributeNameAndValueToLabel = (
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

const getLabelFromHtmlEquivalentAttribute = ({
  attributeName,
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const htmlAttributeName = ariaToHTMLAttributeMapping[attributeName];

  if (!htmlAttributeName) {
    return null;
  }

  const attributeValue = node.getAttribute(htmlAttributeName);

  return mapAttributeNameAndValueToLabel(attributeName, attributeValue);
};

const getLabelFromAriaAttribute = ({
  attributeName,
  node,
}: {
  attributeName: string;
  node: HTMLElement;
}) => {
  const attributeValue = node.getAttribute(attributeName);

  return mapAttributeNameAndValueToLabel(attributeName, attributeValue);
};

const getAttributesByRole = (role: string) => {
  const {
    props: implicitRoleAttributes = {},
    prohibitedProps: prohibitedAttributes = {},
  } = roles.get(role as ARIARoleDefinitionKey) ?? {};

  const globalAttributes = globalStatesAndProperties.filter(
    (attribute) => !Object.keys(prohibitedAttributes).includes(attribute)
  );

  return Array.from(
    new Set([...Object.keys(implicitRoleAttributes), ...globalAttributes])
  );
};

const getAttributeLabels = ({
  node,
  role,
}: {
  node: Node;
  role: string;
}): string[] => {
  const labels = [];

  if (!isElement(node)) {
    return labels;
  }

  const attributes = getAttributesByRole(role);

  attributes.forEach((attributeName) => {
    const labelFromHtmlEquivalentAttribute =
      getLabelFromHtmlEquivalentAttribute({
        attributeName,
        node,
      });

    if (labelFromHtmlEquivalentAttribute) {
      labels.push(labelFromHtmlEquivalentAttribute);

      return;
    }

    const labelFromAriaAttribute = getLabelFromAriaAttribute({
      attributeName,
      node,
    });

    if (labelFromAriaAttribute) {
      labels.push(labelFromAriaAttribute);

      return;
    }

    const labelFromImplicitAriaAttributeValue = mapAttributeNameAndValueToLabel(
      attributeName,
      attributes[attributeName]
    );

    if (labelFromImplicitAriaAttributeValue) {
      labels.push(labelFromImplicitAriaAttributeValue);

      return;
    }
  });

  return labels;
};

// TODO: expose the value (e.g. for input elements) as part of spoken phrase.
export const getSpokenPhrase = (accessibilityNode: AccessibilityNode) => {
  const { accessibleDescription, accessibleName, node, role, spokenRole } =
    accessibilityNode;

  const attributeLabels = getAttributeLabels({
    node,
    role,
  });

  return [spokenRole, accessibleName, accessibleDescription, ...attributeLabels]
    .filter(Boolean)
    .join(", ");
};
