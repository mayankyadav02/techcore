"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { updateMediaAction, uploadMediaAction } from "@/modules/media/actions";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { Upload } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

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

export function MediaLibrary({
  initialItems,
  initialSearch = "",
  page,
  pageCount
}: {
  initialItems: MediaItem[];
  initialSearch?: string;
  page: number;
  pageCount: number;
}) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notify } = useToast();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
          params.set("q", search);
        } else {
          params.delete("q");
        }
        params.delete("page"); // reset to page 1 on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, initialSearch, pathname, searchParams, router]);

  const handleSaveAlt = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await updateMediaAction({ id: selected._id, altText });
    setSaving(false);
    if (res.success) {
      setItems(items.map((i) => (i._id === selected._id ? { ...i, altText } : i)));
      setSelected({ ...selected, altText });
      notify({ title: "Alt text saved", tone: "success" });
      setEditingAlt(false);
    } else {
      notify({ title: "Update failed", description: res.error || "Failed to update alt text", tone: "danger" });
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      notify({ title: "Upload failed", description: "File exceeds 4MB limit", tone: "danger" });
      return;
    }

    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      notify({ title: "Upload failed", description: "Unsupported MIME type", tone: "danger" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadMediaAction(formData);

    if (res.success && res.item) {
      notify({ title: "Media uploaded", tone: "success" });

      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.delete("q");
      router.push(`${pathname}?${params.toString()}`);
    } else {
      notify({ title: "Upload failed", description: res.error || "Failed to upload media", tone: "danger" });
    }

    setUploading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await processFile(file);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb > 1024) return (kb / 1024).toFixed(2) + " MB";
    return kb.toFixed(0) + " KB";
  };

  const currentParams = Object.fromEntries(searchParams.entries());

  return (
    <div
      className="flex flex-col gap-6 relative min-h-[300px]"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[var(--radius-sm)] bg-brand/5 border-2 border-dashed border-brand/50 backdrop-blur-[2px] pointer-events-none">
          <div className="rounded-lg bg-surface px-6 py-4 shadow-lg border border-line">
            <p className="text-sm font-medium text-ink">Drop files here</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp, image/avif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            aria-label="Upload media file"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Media"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <button
            key={item._id}
            type="button"
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-line bg-elevated shadow-sm transition-shadow hover:shadow-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            onClick={() => {
              setSelected(item);
              setAltText(item.altText || "");
              setEditingAlt(false);
            }}
            aria-label={`View ${item.filename}`}
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
          </button>
        ))}
        {items.length === 0 && (
          <EmptyState
            title="No media found"
            description="Upload images to use them across the site."
            className="col-span-full"
          />
        )}
      </div>

      <AdminPagination
        page={page}
        pageCount={pageCount}
        hrefForPage={(p) => listHref(pathname, currentParams, p)}
      />

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
                    <Textarea
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
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
              <div className="border-t border-line mt-auto pt-4 flex justify-end">
                <ConfirmAction
                  label="Delete Media"
                  title="Delete Media"
                  description="Are you sure you want to delete this media? This cannot be undone."
                  confirmLabel="Delete"
                  variant="danger"
                  action={async () => {
                    const { deleteMediaAction } = await import("@/modules/media/actions");
                    const res = await deleteMediaAction(selected._id);
                    if (!res.success) {
                      return { ok: false, code: "DELETE_FAILED", message: res.error || "Failed to delete media" };
                    }
                    return { ok: true, message: "Media deleted" };
                  }}
                  onSuccess={() => {
                    setItems(items.filter(i => i._id !== selected._id));
                    setSelected(null);
                    // if items.length === 1, we deleted the last item on the page. We could refresh the server to fetch properly.
                    if (items.length === 1 && page > 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", String(page - 1));
                      router.push(`${pathname}?${params.toString()}`);
                    } else {
                      router.refresh();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
