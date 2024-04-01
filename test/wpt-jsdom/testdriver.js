const container = window.document.body;

let treeCache = null;

window.observeDOM(window, container, (mutations) => {
  for (const { target } of mutations) {
    if (["manualMode", "log", "ATTAmessages"].includes(target.id)) {
      continue;
    }

    treeCache = null;
  }
});

function getAccessibilityTree() {
  if (!treeCache) {
    treeCache = window.flattenTreeSimple(
      window.createAccessibilityTree(container)
    );
  }

  return treeCache;
}

function getNodeUnderTest(element) {
  const accessibilityTree = getAccessibilityTree();

  return accessibilityTree.find(({ node }) => node === element);
}

window.test_driver = {
  get_computed_label: async function (element) {
    const nodeUnderTest = getNodeUnderTest(element);

    if (!nodeUnderTest) {
      return "";
    }

    return nodeUnderTest.accessibleName ?? nodeUnderTest.accessibleValue;
  },
  get_computed_role: async function (element) {
    const nodeUnderTest = getNodeUnderTest(element);

    if (!nodeUnderTest) {
      return "";
    }

    return nodeUnderTest.role;
  },
};
