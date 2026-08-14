import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  className,
}: {
  page: number;
  pageCount: number;
  className?: string;
}) {
  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-between gap-4 text-sm text-ink-muted",
        className,
      )}
    >
      <span>
        Page {page} of {pageCount}
      </span>
      <span className="text-ink-subtle">Navigation wiring comes with list views.</span>
    </nav>
  );
}
