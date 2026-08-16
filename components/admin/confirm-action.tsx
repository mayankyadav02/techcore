"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/admin/action";

export function ConfirmAction({
  label,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "outline",
  action,
  onSuccess,
}: {
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "outline" | "danger" | "ghost";
  action: () => Promise<ActionResult>;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { notify } = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <>
      <Button
        size="sm"
        variant={variant}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {label}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="max-h-[min(32rem,calc(100dvh-2rem))] w-[min(28rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] border border-line bg-elevated p-0 text-ink shadow-[var(--shadow-md)] backdrop:bg-navy-950/50"
        onClose={() => setOpen(false)}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          <IconButton label="Close dialog" onClick={() => setOpen(false)}>
            <span aria-hidden="true">×</span>
          </IconButton>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-ink-muted">
          <p>{description}</p>
          {error ? (
            <p className="text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await action();
                if (!result.ok) {
                  setError(result.message);
                  notify({
                    title: "Action failed",
                    description: result.message,
                    tone: "danger",
                  });
                  return;
                }
                notify({
                  title: result.message ?? "Saved",
                  tone: "success",
                });
                setOpen(false);
                onSuccess?.();
              });
            }}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
