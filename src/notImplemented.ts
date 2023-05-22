import { ERR_NOT_IMPLEMENTED } from "./errors";

export function notImplemented() {
  throw new Error(ERR_NOT_IMPLEMENTED);
}
