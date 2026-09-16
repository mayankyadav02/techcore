"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

export function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

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
        "relative flex items-center w-full max-w-sm rounded-full bg-elevated/50 border border-line focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all dark:border-white/10 dark:bg-navy-950/50",
        className
      )}
    >
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div className="pl-3 pr-2 py-2 text-ink-muted dark:text-white/50">
        <Search size={16} />
      </div>
      <input
        id="search-input"
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full bg-transparent border-none focus:outline-none text-sm text-ink dark:text-white py-2 pr-4 placeholder:text-ink-muted/70 dark:placeholder:text-white/40"
      />
    </form>
  );
}
