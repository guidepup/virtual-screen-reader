import { StartOptions, Virtual } from "./Virtual";

export const virtual = new Virtual();

type _Virtual = typeof virtual;

export { StartOptions, _Virtual as Virtual };
