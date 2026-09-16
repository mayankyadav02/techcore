import { cn } from "@/lib/utils";

interface RichTextProps {
  content?: string;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  // Fallback for legacy plain text (if it doesn't contain HTML)
  const isPlain = !content.includes("<") && !content.includes(">");
  const html = isPlain
    ? content.split(/\n{2,}/).map((p) => `<p>${p}</p>`).join("")
    : content;

  return (
    <div
      className={cn("prose prose-lg dark:prose-invert max-w-none prose-a:text-brand prose-a:no-underline hover:prose-a:underline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
