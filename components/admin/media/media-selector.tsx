"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { listMediaAction } from "@/modules/media/actions";
import { useDirtyState } from "@/components/admin/dirty-state-provider";

export type MediaItem = {
  _id: string;
  url: string;
  filename: string;
  altText: string;
};

export function MediaSelector({
  value,
  onChange,
  label = "Select Media",
  renderTrigger,
}: {
  value?: string;
  onChange: (id: string, url: string, item: MediaItem) => void;
  label?: string;
  renderTrigger?: (onClick: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const { setDirty } = useDirtyState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageCount, setPageCount] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      listMediaAction(debouncedSearch, page, 24).then((res) => {
        if (res.success && "items" in res && res.items) {
          setItems(res.items as MediaItem[]);
          if ("pageCount" in res && res.pageCount !== undefined) {
            setPageCount(res.pageCount as number);
          }
        }
        setLoading(false);
      });
    }
  }, [open, debouncedSearch, page]);

  // Try to load initial selected item if not present in items array
  useEffect(() => {
    if (value && items.length > 0 && !selected) {
      const match = items.find((i) => i._id === value);
      if (match) setSelected(match);
    }
  }, [value, items, selected]);

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {selected ? (
              <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-sm)] border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.url} alt={selected.filename} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
              {selected ? "Change Media" : label}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Select Media">
        <div className="flex min-h-[300px] flex-col gap-4">
          <div className="flex">
            <input
              type="search"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {items.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    aria-label={`Select ${item.filename}`}
                    className={`group relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                      value === item._id ? "border-brand ring-2 ring-brand ring-offset-1" : "border-line"
                    }`}
                    onClick={() => {
                      onChange(item._id, item.url, item);
                      setSelected(item);
                      setDirty(true);
                      setOpen(false);
                    }}
                  >
                    <div className="aspect-square bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-navy-950/80 p-1 px-2 text-[10px] text-white backdrop-blur-sm truncate">
                      {item.filename}
                    </div>
                  </button>
                ))}
                {items.length === 0 && (
                  <div className="col-span-full py-8 text-center text-sm text-ink-muted">
                    No media found.
                  </div>
                )}
              </div>

              {pageCount > 1 && (
                <div className="flex items-center justify-between mt-4 border-t border-line pt-4">
                  <span className="text-sm text-ink-muted">
                    Page {page} of {pageCount}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      disabled={page >= pageCount}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}
