import type { AccessibilityNodeTree } from "../../../createAccessibilityTree";
import { isElement } from "../../../isElement";

const getFirstNestedChildrenByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree[] =>
  tree.children.flatMap((child) => {
    if (child.role === role) {
      return child;
    }

    return getFirstNestedChildrenByRole({ role, tree: child });
  });

const getParentByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree => {
  let parentTree = tree;

  while (parentTree.role !== role && parentTree.parentAccessibilityNodeTree) {
    parentTree = parentTree.parentAccessibilityNodeTree;
  }

  return parentTree;
};

const getSiblingsByRoleAndLevel = ({
  role,
  parentRole = role,
  tree,
}: {
  role: string;
  parentRole?: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree[] => {
  const parentTree = getParentByRole({ role: parentRole, tree });

  return getFirstNestedChildrenByRole({ role, tree: parentTree });
};

const getFormOwnerTree = ({ tree }: { tree: AccessibilityNodeTree }) =>
  getParentByRole({ role: "form", tree });

const getRadioInputsByName = ({
  name,
  tree,
}: {
  name: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree[] =>
  tree.children.flatMap((child) => {
    if (isElement(child.node) && child.node.getAttribute("name") === name) {
      return child;
    }

    return getRadioInputsByName({ name, tree: child });
  });

/**
 * The radio button group that contains an input element a also contains all
 * the other input elements b that fulfill all of the following conditions:
 *
 * - The input element b's type attribute is in the Radio Button state.
 * - Either a and b have the same form owner, or they both have no form owner.
 * - Both a and b are in the same tree.
 * - They both have a name attribute, their name attributes are not empty, and
 *   the value of a's name attribute equals the value of b's name attribute.
 *
 * REF: https://html.spec.whatwg.org/multipage/input.html#radio-button-group
 */
const getRadioGroup = ({
  node,
  tree,
}: {
  node: HTMLElement;
  tree: AccessibilityNodeTree;
}) => {
  /**
   * Authors SHOULD ensure that elements with role radio are explicitly grouped
   * in order to indicate which ones affect the same value. This is achieved by
   * enclosing the radio elements in an element with role radiogroup. If it is
   * not possible to make the radio buttons DOM children of the radiogroup,
   * authors SHOULD use the aria-owns attribute on the radiogroup element to
   * indicate the relationship to its children.
   */
  if (node.localName !== "input") {
    return getSiblingsByRoleAndLevel({
      role: "radio",
      parentRole: "radiogroup",
      tree,
    });
  }

  if (!node.hasAttribute("name")) {
    return [];
  }

  const name = node.getAttribute("name")!;

  if (!name) {
    return [];
  }

  const formOwnerTree = getFormOwnerTree({ tree });

  return getRadioInputsByName({ name, tree: formOwnerTree });
};

const getChildrenByRole = ({
  role,
  tree,
}: {
  role: string;
  tree: AccessibilityNodeTree;
}): AccessibilityNodeTree[] =>
  tree.children.filter((child) => child.role === role);

/**
 * aria-level, aria-posinset, and aria-setsize are all 1-based. When the
 * property is not present or is "0", it indicates the property is not
 * computed or not supported. If any of these properties are specified by the
 * author as either "0" or a negative number, user agents SHOULD use "1"
 * instead.
 *
 * If aria-level is not provided or inherited for an element of role treeitem
 * or comment, user agents implementing IAccessible2 or ATK/AT-SPI MUST
 * compute it by following the explicit or computed RELATION_NODE_CHILD_OF
 * relations.
 *
 * If aria-posinset and aria-setsize are not provided, user agents MUST
 * compute them as follows:
 *
 * - for role="treeitem" and role="comment", walk the tree backward and
 * forward until the explicit or computed level becomes less than the current
 * item's level. Count items only if they are at the same level as the
 * current item.
 * - Otherwise, if the role supports aria-posinset and aria-setsize, process
 * the parent (DOM parent or parent defined by aria-owns), counting items
 * that have the same role.
 * - Because these value are 1-based, include the current item in the
 * computation. For aria-posinset, include the current item and other group
 * items if they are before the current item in the DOM. For aria-setsize,
 * add to that the number of items in the same group after the current item
 * in the DOM.
 *
 * If the author provides one or more of aria-setsize and aria-posinset, it
 * is the author's responsibility to supply them for all elements in the set.
 * User agent correction of missing values in this case is not defined.
 *
 * REF: https://www.w3.org/TR/core-aam-1.2/#mapping_additional_position
 */
export const getSet = ({
  node,
  role,
  tree,
}: {
  node: HTMLElement;
  tree: AccessibilityNodeTree;
  role: string;
}): Pick<AccessibilityNodeTree, "node">[] => {
  if (role === "treeitem") {
    return getSiblingsByRoleAndLevel({ role, tree });
  }

  /**
   * With aria-setsize value reflecting number of type=radio input elements
   * within the radio button group and aria-posinset value reflecting the
   * elements position within the radio button group.
   *
   * REF: https://www.w3.org/TR/html-aam-1.0/#el-input-radio
   */
  if (role === "radio") {
    return getRadioGroup({ node, tree });
  }

  return getChildrenByRole({
    role,
    tree,
  });
};
