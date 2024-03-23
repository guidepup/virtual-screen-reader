const ACCESSIBILITY_API = "ATK";
const ATK_PROPERTY = "property";
const ATK_NAME = "name";
const ATK_DESCRIPTION = "description";
const ATK_ROLE = "role";

const accessibilityTree = window.createAccessibilityTree(window.document.body);

/**
 * Shim of https://github.com/web-platform-tests/wpt/blob/master/wai-aria/scripts/ATTAcomm.js
 */
class ATTAcommShim {
  constructor({ steps, title }) {
    window.test(() => {
      const element = document.getElementById("test");

      for (const step of steps) {
        const { test } = step;
        const assertions = test[ACCESSIBILITY_API];

        for (const assertion of assertions) {
          const [matcher, name, equality, expected] = assertion;

          if (matcher === ATK_PROPERTY) {
            const nodeUnderTest = accessibilityTree.find(
              ({ node }) => node === element
            );

            switch (name) {
              case ATK_NAME: {
                const actual = nodeUnderTest
                  ? nodeUnderTest.accessibleName ??
                    nodeUnderTest.accessibleValue
                  : "";

                if (equality === "is") {
                  window.assert_equals(actual, expected);

                  continue;
                }

                break;
              }
              case ATK_DESCRIPTION: {
                const actual = nodeUnderTest
                  ? nodeUnderTest.accessibleDescription
                  : "";

                if (equality === "is") {
                  window.assert_equals(actual, expected);

                  continue;
                }

                break;
              }
              case ATK_ROLE: {
                const actual = nodeUnderTest ? nodeUnderTest.role : "";

                if (equality === "is") {
                  window.assert_equals(actual, expected);

                  continue;
                }

                break;
              }
              default: {
                throw new Error("unknown property");
              }
            }
          }

          throw new Error("unknown matcher");
        }
      }

      window.done();
    }, title);
  }
}

window.ATTAcomm = ATTAcommShim;
