"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { IconButton } from "@/components/ui/icon-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminAccountMenu } from "@/components/admin/admin-account-menu";
import { Logo } from "@/components/marketing/logo";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

export function AdminHeader({
  items,
  user,
}: {
  items: { href: string; label: string }[];
  user: { name: string; email: string; roleLabel: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current =
    items.find((item) =>
      item.href === "/admin/dashboard"
        ? pathname === "/admin/dashboard" || pathname === "/admin"
        : pathname.startsWith(item.href),
    )?.label ?? "Admin";

  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-line bg-elevated px-3 sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <IconButton
          ref={menuButtonRef}
          label={open ? "Close navigation" : "Open navigation"}
          className="h-10 w-10 shrink-0 lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon />
        </IconButton>
        <p className="truncate text-sm font-medium text-ink">{current}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <AdminAccountMenu
          name={user.name}
          email={user.email}
          roleLabel={user.roleLabel}
        />
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/40"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <aside
            id={panelId}
            className="relative flex h-full w-[min(16rem,calc(100%-2.5rem))] flex-col overflow-y-auto overscroll-contain bg-navy-950"
          >
            <div className="flex h-14 items-center border-b border-white/10 px-4">
              <Logo inverted size="sm" />
            </div>
            <AdminSidebar items={items} tone="dark" onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
