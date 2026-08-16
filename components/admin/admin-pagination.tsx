import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export function AdminPagination({
  page,
  pageCount,
  hrefForPage,
}: {
  page: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted"
    >
      <span>
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        <Link
          href={hrefForPage(Math.max(1, page - 1))}
          className={buttonClassName({
            variant: "outline",
            size: "sm",
            className: page <= 1 ? "pointer-events-none min-h-10 opacity-50" : "min-h-10",
          })}
          aria-disabled={page <= 1}
        >
          Previous
        </Link>
        <Link
          href={hrefForPage(Math.min(pageCount, page + 1))}
          className={buttonClassName({
            variant: "outline",
            size: "sm",
            className:
              page >= pageCount ? "pointer-events-none min-h-10 opacity-50" : "min-h-10",
          })}
          aria-disabled={page >= pageCount}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}

export function listHref(
  path: string,
  current: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (key === "page") continue;
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
