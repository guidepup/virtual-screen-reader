import { ARIAAttribute, ARIARole, roles } from "html-aria";
import { globalStatesAndProperties } from "../getRole";

const ignoreAttributesWithAccessibleValue = new Set(["aria-placeholder"]);

const nonSpecCompliantAttributeMap: Record<
  string,
  Record<string, boolean | number | string | null>
> = {
  listitem: { "aria-level": null },
  option: { "aria-selected": false },
};

export const getAttributesByRole = ({
  accessibleValue,
  role,
}: {
  accessibleValue: string;
  role: string;
}): [string, string | null][] => {
  const {
    supported: supportedAttributes = [],
    defaultAttributeValues = {},
    prohibited: prohibitedAttributes = [],
  } = roles[role as ARIARole] ?? {};

  const implicitRoleAttributes = {
    ...defaultAttributeValues,
    ...nonSpecCompliantAttributeMap[role],
  };

  const uniqueAttributes = Array.from(
    new Set([
      ...Object.keys(implicitRoleAttributes),
      ...supportedAttributes,
      ...globalStatesAndProperties,
    ])
  )
    .filter(
      (attribute) => !prohibitedAttributes.includes(attribute as ARIAAttribute)
    )
    .filter(
      (attribute) =>
        !accessibleValue || !ignoreAttributesWithAccessibleValue.has(attribute)
    );

  return uniqueAttributes.map((attribute) => [
    attribute,
    attribute in implicitRoleAttributes &&
    implicitRoleAttributes[attribute] !== null
      ? implicitRoleAttributes[attribute].toString()
      : null,
  ]);
};
