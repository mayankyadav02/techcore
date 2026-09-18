export function htmlToSearchText(html: string | undefined | null): string {
  if (!html) return "";
  let text = html.replace(/<[^>]+>/g, " ");
  text = text.replace(/&[a-z0-9#]+;/gi, " ");
  return text.replace(/\s+/g, " ").trim();
}
