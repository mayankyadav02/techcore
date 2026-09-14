"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { listMediaAction } from "@/modules/media/actions";

type MediaItem = {
  _id: string;
  url: string;
  filename: string;
  altText: string;
};

export function MediaSelector({
  value,
  onChange,
  label = "Select Media",
}: {
  value?: string;
  onChange: (id: string, url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (open && items.length === 0) {
      setLoading(true);
      listMediaAction().then((res) => {
        if (res.success && res.items) {
          setItems(res.items as MediaItem[]);
        }
        setLoading(false);
      });
    }
  }, [open, items.length]);

  useEffect(() => {
    if (value && items.length > 0 && !selected) {
      const match = items.find((i) => i._id === value);
      if (match) setSelected(match);
    }
  }, [value, items, selected]);

  return (
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

      <Dialog open={open} onClose={() => setOpen(false)} title="Select Media">
        <div className="flex min-h-[300px] flex-col gap-4">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`group relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border ${
                    value === item._id ? "border-brand" : "border-line"
                  }`}
                  onClick={() => {
                    onChange(item._id, item.url);
                    setSelected(item);
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
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-8 text-center text-sm text-ink-muted">
                  No media found.
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
