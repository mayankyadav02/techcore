"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  items,
  onNavigate,
  tone = "light",
}: {
  items: { href: string; label: string }[];
  onNavigate?: () => void;
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1 overflow-y-auto p-3">
      {items.map((item) => {
        const active =
          item.href === "/admin/dashboard"
            ? pathname === "/admin/dashboard" || pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-10 items-center rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium",
              dark
                ? active
                  ? "bg-brand/15 text-white ring-1 ring-brand/35"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                : active
                  ? "bg-brand/12 text-ink ring-1 ring-brand/30"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
