import { cn } from "@/lib/utils";

export function ContentList({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-muted">
        {items.map((item) => (
          <li key={item} className={cn("border-l-2 border-brand/40 pl-4")}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
