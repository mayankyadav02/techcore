"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; panel: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();

  if (!tabs.length) return null;

  return (
    <div>
      <div role="tablist" aria-label="Content sections" className="flex gap-1 border-b border-line">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-navy-900 text-navy-900"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) =>
        tab.id === active ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-${tab.id}`}
            className="pt-4"
          >
            {tab.panel}
          </div>
        ) : null,
      )}
    </div>
  );
}
