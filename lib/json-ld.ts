/** Serialize JSON-LD so `<`, `>`, and `&` cannot break out of a script tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
