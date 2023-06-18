export function getIdRefsByAttribute({ attributeName, node }) {
  return (node.getAttribute(attributeName) ?? "")
    .trim()
    .split(" ")
    .filter(Boolean);
}
