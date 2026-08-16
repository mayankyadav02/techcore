"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const THRESHOLD = 450;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > THRESHOLD);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        "group fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "border border-brand/25 bg-elevated/80 text-brand-dark",
        "shadow-[0_8px_30px_rgb(0_0_0_/_0.12)] backdrop-blur-xl",
        "transition-[opacity,transform,background-color,border-color,box-shadow] duration-300",
        "hover:-translate-y-1 hover:border-brand/55 hover:bg-brand/10",
        "hover:shadow-[0_12px_35px_rgb(0_200_120_/_0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--surface)]",
        "motion-reduce:hover:translate-y-0",
        "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
        "lg:right-6 lg:bottom-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {/* Subtle rotating/glowing ring */}
      <span
        className="absolute inset-0 rounded-full border border-brand/0 transition-all duration-300 group-hover:border-brand/20"
        aria-hidden="true"
      />

      <ArrowUp
        size={19}
        strokeWidth={1.8}
        className="relative transition-transform duration-300 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}