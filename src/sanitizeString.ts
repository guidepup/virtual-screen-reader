export function sanitizeString(string: string) {
  return string.trim().replace(/\s+/g, " ");
}
