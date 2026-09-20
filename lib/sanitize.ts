import sanitizeHtmlLib from "sanitize-html";

export function sanitizeHtml(html: string | undefined): string {
  if (!html) return "";

  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "strike",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
    ],
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
  });
}
