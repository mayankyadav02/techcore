import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string | undefined): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "s", "strike", 
      "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "style"],
    FORBID_ATTR: ["style", "onclick", "onerror", "onload"],
  });
}
