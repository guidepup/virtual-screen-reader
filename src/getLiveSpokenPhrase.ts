import { getAccessibleName } from "./getNodeAccessibilityData/getAccessibleName";
import { getAccessibleValue } from "./getNodeAccessibilityData/getAccessibleValue";
import { getElementFromNode } from "./getElementFromNode";
import { getRole } from "./getNodeAccessibilityData/getRole";
import { isElement } from "./isElement";
import { sanitizeString } from "./sanitizeString";

/**
 * Live region roles:
 *
 * - alert
 * - log
 * - marquee
 * - status
 * - timer
 * - alertdialog
 *
 * Live region attributes:
 *
 * - aria-atomic
 * - TODO: aria-busy
 * - aria-live
 * - aria-relevant
 *
 * When live regions are marked as polite, assistive technologies SHOULD
 * announce updates at the next graceful opportunity, such as at the end of
 * speaking the current sentence or when the user pauses typing. When live
 * regions are marked as assertive, assistive technologies SHOULD notify the
 * user immediately.
 *
 * REF:
 *
 * - https://www.w3.org/TR/wai-aria-1.2/#live_region_roles
 * - https://www.w3.org/TR/wai-aria-1.2/#window_roles
 * - https://www.w3.org/TR/wai-aria-1.2/#attrs_liveregions
 * - https://www.w3.org/TR/wai-aria-1.2/#aria-live
 */

export enum Live {
  ASSERTIVE = "assertive",
  OFF = "off",
  POLITE = "polite",
}

enum Relevant {
  ADDITIONS = "additions",
  ALL = "all",
  REMOVALS = "removals",
  TEXT = "text",
}

const RELEVANT_VALUES = new Set(Object.values(Relevant));
const DEFAULT_ATOMIC = false;
const DEFAULT_LIVE = Live.OFF;
const DEFAULT_RELEVANT = [Relevant.ADDITIONS, Relevant.TEXT];

function getSpokenPhraseForNode(node: Node) {
  return (
    getAccessibleName(node) ||
    getAccessibleValue(node) ||
    // `node.textContent` is only `null` if the `node` is a `document` or a
    // `doctype`. We don't consider either.

    sanitizeString(node.textContent!)
  );
}

function getAllSpokenPhrase({
  addedNodes,
  removedNodes,
  target,
  type,
}: {
  addedNodes: NodeList;
  removedNodes: NodeList;
  target: Node;
  type: MutationRecordType;
}) {
  return [
    ...getAdditionsSpokenPhrase({
      addedNodes,
    }),
    ...getRemovalsSpokenPhrase({
      removedNodes,
    }),
    ...getTextSpokenPhrase({
      addedNodes,
      target,
      type,
    }),
  ];
}

function getAdditionsSpokenPhrase({ addedNodes }: { addedNodes: NodeList }) {
  return Array.from(addedNodes).filter(isElement).map(getSpokenPhraseForNode);
}

function getRemovalsSpokenPhrase({ removedNodes }: { removedNodes: NodeList }) {
  return Array.from(removedNodes).map(
    (removedNode) => `removal: ${getSpokenPhraseForNode(removedNode)}`
  );
}

const TEXT_NODE = 3;

/**
 * TODO: When text changes are denoted as relevant, user agents MUST monitor
 * any descendant node change that affects the text alternative computation of
 * the live region as if the accessible name were determined from contents
 * (nameFrom: contents). For example, a text change would be triggered if the
 * HTML alt attribute of a contained image changed. However, no change would be
 * triggered if there was a text change to a node outside the live region, even
 * if that node was referenced (via aria-labelledby) by an element contained in
 * the live region.
 */
function getTextSpokenPhrase({
  addedNodes,
  target,
  type,
}: {
  addedNodes: NodeList;
  target: Node;
  type: MutationRecordType;
}) {
  switch (type) {
    case "childList": {
      if (!addedNodes.length) {
        break;
      }

      return Array.from(addedNodes)
        .filter((node) => node.nodeType === TEXT_NODE)
        .map(getSpokenPhraseForNode);
    }
    case "characterData": {
      return [getSpokenPhraseForNode(target)];
    }
  }

  return [];
}

const relevantToSpokenPhraseMap = {
  [Relevant.ADDITIONS]: getAdditionsSpokenPhrase,
  [Relevant.ALL]: getAllSpokenPhrase,
  [Relevant.REMOVALS]: getRemovalsSpokenPhrase,
  [Relevant.TEXT]: getTextSpokenPhrase,
};

const roleToImplicitLiveRegionStatesAndPropertiesMap: Record<
  string,
  { atomic?: boolean; live: Live }
> = {
  alert: {
    atomic: true,
    live: Live.ASSERTIVE,
  },
  log: {
    live: Live.POLITE,
  },
  marquee: {
    live: Live.OFF,
  },
  status: {
    atomic: true,
    live: Live.POLITE,
  },
  timer: {
    live: Live.OFF,
  },
  alertdialog: {
    atomic: true,
    live: Live.ASSERTIVE,
  },
};

function getLiveRegionAttributes(
  {
    container,
    target,
  }: {
    container: Node | null;
    target: Element;
  },
  {
    atomic,
    live,
    liveTarget,
    relevant,
  }: {
    atomic?: boolean;
    live?: Live;
    liveTarget?: Element;
    relevant?: Relevant[];
  } = {}
): { atomic: boolean; live: Live; liveTarget?: Element; relevant: Relevant[] } {
  // TODO: it would be far better if worked with the accessibility tree rather
  // than reconstructing here and making assumptions (though probable) about
  // the allowed roles or inherited presentational roles.
  const accessibleName = getAccessibleName(target);
  const { role } = getRole({
    accessibleName,
    allowedAccessibilityRoles: [],
    inheritedImplicitPresentational: false,
    node: target,
  });

  const implicitAttributes =
    roleToImplicitLiveRegionStatesAndPropertiesMap[role];

  if (typeof atomic === "undefined" && target.hasAttribute("aria-atomic")) {
    atomic = target.getAttribute("aria-atomic") === "true";
  }

  if (typeof live === "undefined" && target.hasAttribute("aria-live")) {
    live = target.getAttribute("aria-live") as Live;
    liveTarget = target;
  }

  if (typeof live === "undefined" && implicitAttributes) {
    live = implicitAttributes.live;
    liveTarget = target;

    if (typeof atomic === "undefined") {
      atomic = implicitAttributes.atomic;
    }
  }

  if (typeof relevant === "undefined" && target.hasAttribute("aria-relevant")) {
    // The `target.hasAttribute("aria-relevant")` check is sufficient to guard
    // against the `target.getAttribute("aria-relevant")` being null.

    relevant = target
      .getAttribute("aria-relevant")!
      .split(" ")
      .filter(
        (token) => !!RELEVANT_VALUES.has(token as Relevant)
      ) as Relevant[];

    if (relevant.includes(Relevant.ALL)) {
      relevant = [Relevant.ALL];
    }
  }

  if (
    typeof atomic !== "undefined" &&
    typeof live !== "undefined" &&
    typeof relevant !== "undefined"
  ) {
    return {
      atomic,
      live,
      liveTarget,
      relevant,
    };
  }

  const targetAncestor = target.parentElement;

  if (target === container || targetAncestor === null) {
    return {
      atomic: atomic ?? DEFAULT_ATOMIC,
      live: live ?? DEFAULT_LIVE,
      liveTarget,
      relevant: relevant ?? DEFAULT_RELEVANT,
    };
  }

  return getLiveRegionAttributes(
    { container, target: targetAncestor },
    {
      atomic,
      live,
      liveTarget,
      relevant,
    }
  );
}

export function getLiveSpokenPhrase({
  container,
  mutation: { addedNodes, removedNodes, target, type },
}: {
  container: Node | null;
  mutation: MutationRecord;
}): string {
  const { atomic, live, liveTarget, relevant } = getLiveRegionAttributes({
    container,
    target: getElementFromNode(target),
  });

  if (live === Live.OFF || !liveTarget) {
    return "";
  }

  /**
   * TODO: Indicates whether assistive technologies will present all, or only
   * parts of, the changed region based on the change notifications defined by
   * the aria-relevant attribute.
   *
   * REF: https://www.w3.org/TR/wai-aria-1.2/#aria-atomic
   *
   * This indicates that the behaviour of aria-atomic is informed by
   * aria-relevant in some way, which is not explained well by the
   * specification.
   *
   * Given the lack of aria-relevant usage this is perhaps not one to dwell on?
   * REF: https://github.com/w3c/aria/issues/712
   */
  if (atomic) {
    return `${live}: ${getSpokenPhraseForNode(liveTarget)}`;
  }

  const spokenPhrases = relevant
    .flatMap((relevantType) =>
      relevantToSpokenPhraseMap[relevantType]({
        addedNodes,
        removedNodes,
        target,
        type,
      })
    )
    .filter(Boolean)
    .join(", ");

  if (!spokenPhrases) {
    return "";
  }

  return `${live}: ${spokenPhrases}`;
}
