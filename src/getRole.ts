import { getRoles as getImplicitRoles } from "@testing-library/dom";

const ignoredRoles = ["presentation", "none"];

function getRoles(element: Element) {
  if (element.role) {
    return element.role.split(" ");
  }

  const clone = element.cloneNode() as HTMLElement;
  const roles = getImplicitRoles(clone);

  return Object.keys(roles);
}

export function getRole(element: Element) {
  const roles = getRoles(element);

  return roles.filter((role) => !ignoredRoles.includes(role)).join(" ");
}
