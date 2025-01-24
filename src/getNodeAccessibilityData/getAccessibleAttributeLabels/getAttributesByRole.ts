import { ARIARoleDefinitionKey, roles } from "aria-query";
import { globalStatesAndProperties, reverseSynonymRolesMap } from "../getRole";

const ignoreAttributesWithAccessibleValue = new Set(["aria-placeholder"]);

export const getAttributesByRole = ({
  accessibleValue,
  role,
}: {
  accessibleValue: string;
  role: string;
}): [string, string | null][] => {
  // TODO: temporary solution until aria-query is updated with WAI-ARIA 1.3
  // synonym roles, or the html-aria package supports implicit attribute
  // values.
  const reverseSynonymRole = (reverseSynonymRolesMap[role] ??
    role) as ARIARoleDefinitionKey;

  // TODO: swap out with the html-aria package if implicit role attributes
  // become supported.
  const {
    props: implicitRoleAttributes = {},
    prohibitedProps: prohibitedAttributes = [],
  } = (roles.get(reverseSynonymRole) ?? {}) as {
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
