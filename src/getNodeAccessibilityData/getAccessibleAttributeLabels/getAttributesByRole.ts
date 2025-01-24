import { ARIARoleDefinitionKey, roles } from "aria-query";
import { globalStatesAndProperties } from "../getRole";

const ignoreAttributesWithAccessibleValue = new Set(["aria-placeholder"]);

export const getAttributesByRole = ({
  accessibleValue,
  role,
}: {
  accessibleValue: string;
  role: string;
}): [string, string | null][] => {
  // TODO: swap out with the html-aria package if implicit role attributes
  // become supported.
  const {
    props: implicitRoleAttributes = {},
    prohibitedProps: prohibitedAttributes = [],
  } = (roles.get(role as ARIARoleDefinitionKey) ?? {}) as {
    props: Record<string, string | undefined>;
    prohibitedProps: string[];
  };

  const uniqueAttributes = Array.from(
    new Set([
      ...Object.keys(implicitRoleAttributes),
      ...globalStatesAndProperties,
    ])
  )
    .filter((attribute) => !prohibitedAttributes.includes(attribute))
    .filter(
      (attribute) =>
        !accessibleValue || !ignoreAttributesWithAccessibleValue.has(attribute)
    );

  return uniqueAttributes.map((attribute) => [
    attribute,
    implicitRoleAttributes[attribute] ?? null,
  ]);
};
