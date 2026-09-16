import DOMPurify from "isomorphic-dompurify";

DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "src" && data.attrValue.trim().toLowerCase().startsWith("data:")) {
    node.removeAttribute("src");
    data.keepAttr = false;
  }
});

export function sanitizeHtml(html: string | undefined): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "s", "strike", 
      "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "style"],
    FORBID_ATTR: ["style", "onclick", "onerror", "onload"],
  });
}
