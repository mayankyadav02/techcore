"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { updateMediaAction } from "@/modules/media/actions";

type MediaItem = {
  _id: string;
  url: string;
  filename: string;
  altText: string;
  mimeType: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
};

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveAlt = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await updateMediaAction({ id: selected._id, altText });
    setSaving(false);
    if (res.success) {
      setItems(items.map((i) => (i._id === selected._id ? { ...i, altText } : i)));
      setSelected({ ...selected, altText });
      setEditingAlt(false);
    } else {
      alert(res.error || "Failed to update alt text");
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb > 1024) return (kb / 1024).toFixed(2) + " MB";
    return kb.toFixed(0) + " KB";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <input
          type="search"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface shadow-sm transition-shadow hover:shadow-md"
            onClick={() => {
              setSelected(item);
              setAltText(item.altText || "");
              setEditingAlt(false);
            }}
          >
            <div className="aspect-square bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.filename}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="border-t border-line p-2">
              <p className="truncate text-xs font-medium text-ink" title={item.filename}>
                {item.filename}
              </p>
              <p className="mt-0.5 text-[10px] text-ink-muted">
                {item.width && item.height ? `${item.width}x${item.height}` : "Unknown dimensions"}
              </p>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-ink-muted">
            No media found.
          </div>
        )}
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title="Media Details">
        {selected && (
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex-1 overflow-hidden rounded-md border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.url}
                alt={selected.filename}
                className="h-full max-h-[400px] w-full object-contain"
              />
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-64">
              <div>
                <h4 className="text-sm font-semibold text-ink">Filename</h4>
                <p className="break-all text-sm text-ink-muted">{selected.filename}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">File type</h4>
                <p className="text-sm text-ink-muted">{selected.mimeType}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">File size</h4>
                <p className="text-sm text-ink-muted">{formatSize(selected.sizeBytes)}</p>
              </div>
              {selected.width && selected.height && (
                <div>
                  <h4 className="text-sm font-semibold text-ink">Dimensions</h4>
                  <p className="text-sm text-ink-muted">
                    {selected.width} x {selected.height} pixels
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-ink">Public URL</h4>
                <p className="break-all text-xs text-ink-muted">{selected.url}</p>
              </div>
              <div className="border-t border-line pt-4">
                <h4 className="mb-2 text-sm font-semibold text-ink">Alt Text</h4>
                {editingAlt ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="min-h-[80px] w-full rounded-[var(--radius-sm)] border border-line bg-surface p-2 text-sm text-ink outline-none focus:border-brand"
                      placeholder="Describe the image for screen readers"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveAlt} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingAlt(false)} disabled={saving}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <p className="text-sm text-ink-muted">
                      {selected.altText || <span className="italic text-ink-subtle">No alt text provided</span>}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                      onClick={() => setEditingAlt(true)}
                    >
                      Edit Alt Text
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
