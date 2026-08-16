"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, FolderKanban, Home, Layers, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/solutions", label: "Solutions", icon: Layers },
  { href: "/", label: "Home", icon: Home, raised: true },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/contact", label: "Contact", icon: Mail },
] as const;

function tabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated/92 shadow-[0_-8px_24px_rgb(7_17_31_/_0.08)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-[4.25rem] max-w-[80rem] grid-cols-5 items-end px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = tabActive(pathname, item.href);
          const raised = "raised" in item && item.raised;

          return (
            <li key={item.href} className="flex h-full items-end justify-center">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "flex min-h-11 w-full flex-col items-center justify-end gap-0.5 pb-2 text-[0.65rem] font-medium",
                  raised && "relative justify-end pb-2 pt-6",
                  active ? "text-brand-dark" : "text-ink-muted",
                )}
              >
                {raised ? (
                  <span
                    className={cn(
                      "absolute -top-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-navy-950 shadow-[var(--shadow-md)] ring-4 ring-surface transition-transform duration-200",
                      active && "ring-brand/35",
                    )}
                  >
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                ) : (
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
