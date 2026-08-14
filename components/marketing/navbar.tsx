"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { publicCta, publicNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button-link";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/marketing/logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[80rem] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-navy-900"
                  : "text-ink-muted hover:text-navy-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <ButtonLink href={publicCta.href} size="sm">
            {publicCta.label}
          </ButtonLink>
        </div>
        <IconButton
          label={open ? "Close menu" : "Open menu"}
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </div>
      {open ? (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-line py-3 text-base font-medium",
                  pathname === item.href ? "text-navy-900" : "text-ink-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <ButtonLink href={publicCta.href} className="w-full">
                {publicCta.label}
              </ButtonLink>
            </div>
          </nav>
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
