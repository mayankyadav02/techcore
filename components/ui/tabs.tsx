"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: { id: string; label: string; panel?: React.ReactNode; error?: boolean; href?: string }[];
  activeId?: string;
  onChange?: (id: string) => void;
}) {
  const [internalActive, setInternalActive] = useState(tabs.find(t => !t.href)?.id || tabs[0]?.id);
  const active = activeId !== undefined ? activeId : internalActive;
  const setActive = onChange || setInternalActive;
  const baseId = useId();

  if (!tabs.length) return null;

  return (
    <div>
      <div role="tablist" aria-label="Content sections" className="flex gap-1 border-b border-line overflow-x-auto [-webkit-overflow-scrolling:touch]">
        {tabs.map((tab) => {
          const selected = tab.id === active && !tab.href;

          const className = cn(
            "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
            selected
              ? "border-brand text-ink"
              : "border-transparent text-ink-muted hover:text-ink",
          );

          const content = (
            <>
              {tab.label}
              {tab.error && (
                <span className="flex h-2 w-2 rounded-full bg-danger" aria-hidden="true" title="Contains validation errors" />
              )}
            </>
          );

          if (tab.href) {
            return (
              <Link key={tab.id} href={tab.href} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              aria-label={tab.error ? `${tab.label} (Contains validation errors)` : undefined}
              className={className}
              onClick={() => setActive(tab.id)}
            >
              {content}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) =>
        tab.id === active && tab.panel ? (
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
