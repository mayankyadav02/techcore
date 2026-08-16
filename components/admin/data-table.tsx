import { EmptyState } from "@/components/ui/empty-state";

export function DataTable({
  columns,
  children,
  emptyTitle,
  emptyDescription,
  isEmpty,
}: {
  columns: string[];
  children: React.ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto overscroll-x-contain rounded-[var(--radius-lg)] border border-line bg-elevated shadow-[var(--shadow-sm)] [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[36rem] text-left text-sm sm:min-w-[44rem] [&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-10 [&_td:first-child]:bg-elevated">
        <thead className="border-b border-line bg-surface-muted text-xs font-medium tracking-wide text-ink-subtle uppercase">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                className={
                  index === 0
                    ? "sticky left-0 z-10 bg-surface-muted px-3 py-3 font-medium whitespace-nowrap sm:px-4"
                    : "px-3 py-3 font-medium whitespace-nowrap sm:px-4"
                }
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
