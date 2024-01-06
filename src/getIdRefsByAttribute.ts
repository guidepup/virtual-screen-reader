export function getIdRefsByAttribute({
  attributeName,
  node,
}: {
  attributeName: string;
  node: Element;
}) {
  return (node.getAttribute(attributeName) ?? "")
    .trim()
    .split(" ")
    .filter(Boolean);
}
