"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useId } from "react";
import { cn } from "@/lib/utils";

export function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchId = useId();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full max-w-sm rounded-full bg-elevated/50 border border-line focus-within:border-ink/30 focus-within:ring-1 focus-within:ring-ink/30 transition-all dark:border-white/10 dark:bg-navy-950/50 dark:focus-within:border-white/30 dark:focus-within:ring-white/30 overflow-hidden",
        className
      )}
    >
      <label htmlFor={searchId} className="sr-only">
        Search
      </label>
      <input
        id={searchId}
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1 min-w-0 bg-transparent border-none focus:outline-none text-sm text-ink dark:text-white py-2 pl-4 pr-1 placeholder:text-ink-muted/70 dark:placeholder:text-white/40"
      />
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 flex items-center justify-center self-stretch px-3 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:bg-surface-muted dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
