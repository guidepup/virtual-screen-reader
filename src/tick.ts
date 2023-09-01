export async function tick() {
  return await new Promise<void>((resolve) => setTimeout(() => resolve()));
}
