"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

export function BrandLoadingScreen({
  label = "Loading",
}: {
  label?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-hidden bg-navy-950 text-white",
        "animate-[fadeIn_300ms_ease-out]",
      )}
      role="status"
      aria-label={label}
    >
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
        style={{
          backgroundImage: "url('/images/hero.png')",
        }}
        aria-hidden="true"
      />

      {/* Premium dark overlay */}
      <div
        className="absolute inset-0 bg-navy-950/75"
        aria-hidden="true"
      />

      {/* Subtle directional gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-950/70 to-navy-950/90"
        aria-hidden="true"
      />

      {/* Soft brand glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center">
        <div className="animate-[loadingLogo_900ms_ease-out]">
          <Logo
            inverted
            size="lg"
            priority
            className="scale-[1.35] sm:scale-[1.55]"
          />
        </div>

        <p className="mt-9 max-w-md text-sm leading-6 tracking-wide text-white/65 sm:text-base">
          Digital solutions built for businesses that want to grow.
        </p>

        {/* Loading indicator */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div
            className="h-1 w-28 overflow-hidden rounded-full bg-white/10"
            aria-hidden="true"
          >
            <div className="h-full w-1/2 animate-[loadingBar_1.4s_ease-in-out_infinite] rounded-full bg-brand" />
          </div>

          <span className="text-[0.65rem] font-medium tracking-[0.2em] text-white/40 uppercase">
            {label}
          </span>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute inset-x-0 bottom-7 z-10 text-center">
        <p className="text-[0.6rem] font-medium tracking-[0.25em] text-white/30 uppercase">
          Technology · Design · Delivery
        </p>
      </div>

      <style jsx global>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(220%);
          }
        }

        @keyframes loadingLogo {
          from {
            opacity: 0;
            transform: translateY(10px) scale(1.25);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1.35);
          }
        }

        @media (min-width: 640px) {
          @keyframes loadingLogo {
            from {
              opacity: 0;
              transform: translateY(10px) scale(1.4);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1.55);
            }
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[loadingLogo_900ms_ease-out\\],
          .animate-\\[loadingBar_1\\.4s_ease-in-out_infinite\\],
          .animate-\\[fadeIn_300ms_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}