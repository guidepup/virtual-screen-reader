const dialogRoles = new Set(["dialog", "alertdialog"]);

export const isDialogRole = (role: string) => dialogRoles.has(role);
