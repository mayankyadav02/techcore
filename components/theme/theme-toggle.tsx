"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_COOKIE, isThemeValue, type ThemeValue } from "@/lib/theme";
import { cn } from "@/lib/utils";

function readPreference(): ThemeValue {
  if (typeof document === "undefined") return "system";
  const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : "system";
  return isThemeValue(value) ? value : "system";
}

function applyAppearance(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function persistTheme(theme: "light" | "dark") {
  applyAppearance(theme === "dark");
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function ThemeToggle({
  className,
  invert = false,
}: {
  className?: string;
  compact?: boolean;
  invert?: boolean;
}) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      if (readPreference() === "system") applyAppearance(media.matches);
    };
    media.addEventListener("change", onMedia);
    return () => media.removeEventListener("change", onMedia);
  }, []);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
        invert
          ? "text-white hover:bg-white/12"
          : "text-ink hover:bg-surface-muted",
        className,
      )}
      onClick={() => {
        const dark = document.documentElement.classList.contains("dark");
        persistTheme(dark ? "light" : "dark");
      }}
    >
      <Moon size={18} strokeWidth={1.75} aria-hidden="true" className="dark:hidden" />
      <Sun size={18} strokeWidth={1.75} aria-hidden="true" className="hidden dark:block" />
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
    </button>
  );
}
