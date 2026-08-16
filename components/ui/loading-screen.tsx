"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

const MIN_LOADING_TIME = 2000;

export function LoadingScreen({
  label = "Loading",
}: {
  label?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, MIN_LOADING_TIME);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-hidden bg-navy-950 text-white",
        "transition-opacity duration-500",
        ready ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      aria-label={label}
      role="status"
    >
      {/* Hero background */}
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark premium overlay */}
      <div className="absolute inset-0 bg-navy-950/75" />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/65 to-navy-950/95" />

      {/* Subtle glow */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgb(0 200 120 / 0.12), transparent 42%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="animate-[loadingLogo_1.4s_ease-in-out_infinite]">
          <Logo inverted size="lg" priority />
        </div>

        <p className="mt-7 max-w-md text-sm leading-6 text-white/65 sm:text-base">
          Technology should solve business problems, not create new ones.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <div
            className="h-1 w-36 overflow-hidden rounded-full bg-white/10"
            aria-hidden="true"
          >
            <div className="h-full w-1/2 animate-[loadingBar_1.5s_ease-in-out_infinite] rounded-full bg-brand" />
          </div>

          <span className="text-[0.68rem] font-medium tracking-[0.22em] text-white/40 uppercase">
            {label}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingLogo {
          0%,
          100% {
            opacity: 0.72;
            transform: scale(0.985);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-110%);
          }
          50% {
            transform: translateX(80%);
          }
          100% {
            transform: translateX(210%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}