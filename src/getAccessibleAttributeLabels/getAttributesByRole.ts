import { ARIARoleDefinitionKey, roles } from "aria-query";
import { globalStatesAndProperties } from "../getRole";

export const getAttributesByRole = (role: string) => {
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
