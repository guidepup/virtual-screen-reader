import { getAccessibleName } from "./getNodeAccessibilityData/getAccessibleName";
import { getAccessibleValue } from "./getNodeAccessibilityData/getAccessibleValue";
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
 * - aria-busy
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
 * - https://w3c.github.io/aria/#live_region_roles
 * - https://w3c.github.io/aria/#window_roles
 * - https://w3c.github.io/aria/#attrs_liveregions
 * - https://w3c.github.io/aria/#aria-live
 */

enum Live {
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

const RELEVANT_VALUES = Object.values(Relevant);
const DEFAULT_ATOMIC = false;
const DEFAULT_LIVE = Live.OFF;
const DEFAULT_RELEVANT = [Relevant.ADDITIONS, Relevant.TEXT];

function getSpokenPhraseForNode(node: Node) {
  return (
    getAccessibleName(node) ||
    getAccessibleValue(node) ||
    sanitizeString(node.textContent)
  );
}

function getAdditionsSpokenPhrase({ addedNodes }: { addedNodes: NodeList }) {
  return Array.from(addedNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map(getSpokenPhraseForNode);
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

function getRemovalsSpokenPhrase({ removedNodes }: { removedNodes: NodeList }) {
  return Array.from(removedNodes).map(getSpokenPhraseForNode);
}

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
        .filter((node) => node.nodeType === Node.TEXT_NODE)
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
  if (!atomic && target.hasAttribute("aria-atomic")) {
    atomic = target.getAttribute("aria-atomic") === "true";
  }

  if (!live && target.hasAttribute("aria-live")) {
    live = target.getAttribute("aria-live") as Live;
    liveTarget = target;
  }

  if (!relevant && target.hasAttribute("aria-relevant")) {
    relevant = target
      .getAttribute("aria-relevant")
      .split(" ")
      .filter(
        (token) => !!RELEVANT_VALUES.includes(token as Relevant)
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

  if (target === container) {
    return {
      atomic: atomic ?? DEFAULT_ATOMIC,
      live: live ?? DEFAULT_LIVE,
      liveTarget,
      relevant: relevant ?? DEFAULT_RELEVANT,
    };
  }

  const targetAncestor = target.parentElement;

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
    target:
      target.nodeType === Node.ELEMENT_NODE
        ? (target as Element)
        : target.parentElement,
  });

  if (live === Live.OFF || !liveTarget) {
    return "";
  }

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
