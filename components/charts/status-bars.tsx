import { EmptyState } from "@/components/ui/empty-state";

export type StatusCount = {
  status: string;
  count: number;
};

function labelFor(status: string) {
  return status.replaceAll("_", " ");
}

export function StatusBars({
  title,
  emptyTitle,
  items,
}: {
  title: string;
  emptyTitle: string;
  items: StatusCount[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...items.map((item) => item.count), 0);

  return (
    <section className="rounded-[var(--radius-lg)] border border-line bg-elevated p-5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {total === 0 ? (
        <div className="mt-4">
          <EmptyState title={emptyTitle} className="border-0 bg-transparent py-8" />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const width = max === 0 ? 0 : Math.round((item.count / max) * 100);
            return (
              <li key={item.status}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                  <span className="capitalize text-ink-muted">{labelFor(item.status)}</span>
                  <span className="tabular-nums text-ink">{item.count}</span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface-muted"
                  role="img"
                  aria-label={`${labelFor(item.status)}: ${item.count}`}
                >
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
