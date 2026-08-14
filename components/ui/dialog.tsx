"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
    }
    if (!open && node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="w-[min(32rem,calc(100%-2rem))] rounded-[var(--radius-lg)] border border-line bg-white p-0 text-ink shadow-[var(--shadow-md)] backdrop:bg-navy-950/50"
      onClose={onClose}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        <IconButton label="Close dialog" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="px-5 py-4 text-sm text-ink-muted">{children}</div>
      <div className="flex justify-end border-t border-line px-5 py-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </dialog>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
