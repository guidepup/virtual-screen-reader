import { getAccessibleName } from "../getAccessibleName";
import { getAccessibleValue } from "../getAccessibleValue";
import { getItemText } from "../../getItemText";
import { getNodeByIdRef } from "../../getNodeByIdRef";

type ValueOf<T> = T[keyof T];

const STATE = {
  BUSY: "busy",
  CHECKED: "checked",
  CURRENT: "current item",
  DISABLED: "disabled",
  EXPANDED: "expanded",
  INVALID: "invalid",
  MODAL: "modal",
  MULTI_SELECTABLE: "multi-selectable",
  PARTIALLY_CHECKED: "partially checked",
  PARTIALLY_PRESSED: "partially pressed",
  PRESSED: "pressed",
  READ_ONLY: "read only",
  REQUIRED: "required",
  SELECTED: "selected",
};

// https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
const ariaPropertyToVirtualLabelMap: Record<
  string,
  ((mapperArgs: MapperArgs) => string | null) | null
> = {
  "aria-activedescendant": idRef("active descendant"),
  "aria-atomic": null, // Handled by live region logic
  "aria-autocomplete": token({
    inline: "autocomplete inlined",
    list: "autocomplete in list",
    both: "autocomplete inlined and in list",
    none: "no autocomplete",
  }),
  "aria-braillelabel": null, // Currently won't do - not implementing a braille screen reader
  "aria-brailleroledescription": null, // Currently won't do - not implementing a braille screen reader
  "aria-busy": state(STATE.BUSY),
  "aria-checked": tristate(STATE.CHECKED, STATE.PARTIALLY_CHECKED),
  "aria-colcount": integer("column count"),
  "aria-colindex": integer("column index"),
  "aria-colindextext": string("column index"),
  "aria-colspan": integer("column span"),
  "aria-controls": idRefs("control", "controls"), // Handled by virtual.perform()
  "aria-current": token({
    page: "current page",
    step: "current step",
    location: "current location",
    date: "current date",
    time: "current time",
    true: STATE.CURRENT,
    false: `not ${STATE.CURRENT}`,
  }),
  "aria-describedby": null, // Handled by accessible description
  "aria-description": null, // Handled by accessible description
  "aria-details": idRefs("linked details", "linked details", false),
  "aria-disabled": state(STATE.DISABLED),
  "aria-dropeffect": null, // Deprecated in WAI-ARIA 1.1
  "aria-errormessage": errorMessageIdRefs("error message", "error messages"),
  "aria-expanded": state(STATE.EXPANDED),
  "aria-flowto": idRefs("alternate reading order", "alternate reading orders"), // Handled by virtual.perform()
  "aria-grabbed": null, // Deprecated in WAI-ARIA 1.1
  "aria-haspopup": token({
    /**
     * Assistive technologies SHOULD NOT expose the aria-haspopup property if
     * it has a value of false.
     *
     * REF: // https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup
     */
    false: null,
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
    false: `not ${STATE.INVALID}`,
    spelling: "spelling error detected",
    true: STATE.INVALID,
  }),
  "aria-keyshortcuts": string("key shortcuts"),
  "aria-label": null, // Handled by accessible name
  "aria-labelledby": null, // Handled by accessible name
  "aria-level": integer("level"),
  "aria-live": null, // Handled by live region logic
  "aria-modal": state(STATE.MODAL),
  "aria-multiselectable": state(STATE.MULTI_SELECTABLE),
  "aria-orientation": token({
    horizontal: "orientated horizontally",
    vertical: "orientated vertically",
  }),
  "aria-owns": null, // Handled by accessibility tree construction
  "aria-placeholder": string("placeholder"),
  "aria-posinset": integer("position"),
  "aria-pressed": tristate(STATE.PRESSED, STATE.PARTIALLY_PRESSED),
  "aria-readonly": state(STATE.READ_ONLY),
  "aria-relevant": null, // Handled by live region logic
  "aria-required": state(STATE.REQUIRED),
  "aria-roledescription": null, // Handled by accessible description
  "aria-rowcount": integer("row count"),
  "aria-rowindex": integer("row index"),
  "aria-rowindextext": string("row index"),
  "aria-rowspan": integer("row span"),
  "aria-selected": state(STATE.SELECTED),
  "aria-setsize": integer("set size"),
  "aria-sort": token({
    ascending: "sorted in ascending order",
    descending: "sorted in descending order",
    none: "no defined sort order",
    other: "non ascending / descending sort order applied",
  }),
  "aria-valuemax": number("max value"),
  "aria-valuemin": number("min value"),
  "aria-valuenow": number("current value"),
  "aria-valuetext": string("current value"),
};

interface MapperArgs {
  attributeValue: string;
  container: Node;
  negative?: boolean;
  node?: HTMLElement;
}

function state(stateValue: ValueOf<typeof STATE>) {
  return function stateMapper({ attributeValue, negative }: MapperArgs) {
    if (negative) {
      return attributeValue !== "false" ? `not ${stateValue}` : stateValue;
    }

    return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
  };
}

function errorMessageIdRefs(
  propertyDescriptionSuffixSingular: string,
  propertyDescriptionSuffixPlural: string,
  printCount = true
) {
  return function mapper({ attributeValue, container, node }: MapperArgs) {
    // TODO: use implicit values for aria-invalid:
    // - spellcheck
    // - pattern
    if (node?.getAttribute("aria-invalid") === "false") {
      return "";
    }

    return idRefs(
      propertyDescriptionSuffixSingular,
      propertyDescriptionSuffixPlural,
      printCount
    )({ attributeValue, container });
  };
}

function idRefs(
  propertyDescriptionSuffixSingular: string,
  propertyDescriptionSuffixPlural: string,
  printCount = true
) {
  return function mapper({ attributeValue, container }: MapperArgs) {
    const idRefsCount = attributeValue
      .trim()
      .split(" ")
      .filter(
        (idRef) => !!container && !!getNodeByIdRef({ container, idRef })
      ).length;

    if (idRefsCount === 0) {
      return "";
    }

    return `${printCount ? `${idRefsCount} ` : ""}${
      idRefsCount === 1
        ? propertyDescriptionSuffixSingular
        : propertyDescriptionSuffixPlural
    }`;
  };
}

function idRef(propertyName: string) {
  return function mapper({ attributeValue: idRef, container }: MapperArgs) {
    const node = getNodeByIdRef({ container, idRef });

    if (!node) {
      return "";
    }

    const accessibleName = getAccessibleName(node);
    const accessibleValue = getAccessibleValue(node);
    const itemText = getItemText({ accessibleName, accessibleValue });

    return concat(propertyName)({ attributeValue: itemText, container });
  };
}

function tristate(
  stateValue: ValueOf<typeof STATE>,
  mixedValue: ValueOf<typeof STATE>
) {
  return function stateMapper({ attributeValue }: MapperArgs) {
    if (attributeValue === "mixed") {
      return mixedValue;
    }

    return attributeValue !== "false" ? stateValue : `not ${stateValue}`;
  };
}

function token(tokenMap: Record<string, string | null>) {
  return function tokenMapper({ attributeValue }: MapperArgs) {
    return tokenMap[attributeValue];
  };
}

function concat(propertyName: string) {
  return function mapper({ attributeValue }: MapperArgs) {
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
  container,
  negative = false,
  node,
}: {
  attributeName: string;
  attributeValue: string | null;
  container: Node;
  negative?: boolean;
  node: HTMLElement;
}) => {
  if (typeof attributeValue !== "string") {
    return null;
  }

  const mapper = ariaPropertyToVirtualLabelMap[attributeName];

  return mapper?.({ attributeValue, container, negative, node }) ?? null;
};
