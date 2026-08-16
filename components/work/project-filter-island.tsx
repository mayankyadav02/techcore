"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  portfolioFilterIds,
  type PortfolioFilterId,
} from "@/lib/work/portfolio-filters";

export function ProjectFilterIsland({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<PortfolioFilterId>("All");
  const [empty, setEmpty] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    let visible = 0;
    root.querySelectorAll<HTMLElement>("[data-portfolio-tags]").forEach((node) => {
      const tags = (node.dataset.portfolioTags ?? "").split(",").filter(Boolean);
      const show = filter === "All" || tags.includes(filter);
      node.hidden = !show;
      if (show) visible += 1;
    });
    setEmpty(visible === 0);
  }, [filter]);

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
        role="toolbar"
        aria-labelledby={labelId}
      >
        <p id={labelId} className="sr-only">
          Filter programmes by type
        </p>
        {portfolioFilterIds.map((id) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(id)}
              className={
                active
                  ? "inline-flex min-h-11 shrink-0 items-center rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-surface"
                  : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line bg-elevated px-4 py-1.5 text-sm font-medium text-ink-muted hover:border-ink hover:text-ink"
              }
            >
              {id}
            </button>
          );
        })}
      </div>
      <div ref={gridRef} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
      {empty ? (
        <EmptyState
          className="mt-8"
          title="No programmes in this category"
          description="Try another filter. These cases are fictional demonstrations, not a live client roster."
        />
      ) : null}
    </div>
  );
}
