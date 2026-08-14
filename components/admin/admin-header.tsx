"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNav } from "@/lib/site";
import { IconButton } from "@/components/ui/icon-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current =
    adminNav.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
    )?.label ?? "Admin";

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <IconButton
          label={open ? "Close navigation" : "Open navigation"}
          className="lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon />
        </IconButton>
        <p className="text-sm font-medium text-ink">{current}</p>
      </div>
      <p className="text-xs text-ink-subtle">Admin preview</p>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/40"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-64 bg-navy-900">
            <div className="flex h-14 items-center border-b border-white/10 px-4 text-sm font-semibold text-white">
              TechCore CMS
            </div>
            <AdminSidebar onNavigate={() => setOpen(false)} />
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
