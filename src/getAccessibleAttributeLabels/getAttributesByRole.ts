import { ARIAPropertyMap, ARIARoleDefinitionKey, roles } from "aria-query";
import { globalStatesAndProperties } from "../getRole";

export const getAttributesByRole = (role: string) => {
  const {
    props: implicitRoleAttributes = {},
    prohibitedProps: prohibitedAttributes = [],
  } = (roles.get(role as ARIARoleDefinitionKey) ?? {}) as {
    props: ARIAPropertyMap;
    prohibitedProps: string[];
  };

  const uniqueAttributes = Array.from(
    new Set([
      ...Object.keys(implicitRoleAttributes),
      ...globalStatesAndProperties,
    ])
  ).filter((attribute) => !prohibitedAttributes.includes(attribute));

  return uniqueAttributes.map((attribute) => [
    attribute,
    implicitRoleAttributes[attribute] ?? null,
  ]);
};
