"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminAccountMenu({
  name,
  email,
  roleLabel,
}: {
  name: string;
  email: string;
  roleLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-left hover:bg-surface-muted"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-medium text-navy-950">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-medium text-ink">{name}</span>
          <span className="block text-xs text-ink-subtle">{roleLabel}</span>
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-[min(14rem,calc(100vw-1.5rem))] rounded-[var(--radius-md)] border border-line bg-elevated py-2 shadow-sm"
        >
          <div className="border-b border-line px-3 pb-2">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <p className="truncate text-xs text-ink-subtle">{email}</p>
          </div>
          <div className="px-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                await fetch("/api/auth/logout", { method: "POST" });
                router.replace("/admin/login");
                router.refresh();
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
