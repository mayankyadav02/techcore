import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/content/services";

const paths: Record<IconName, ReactNode> = {
  web: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="1.5" />
      <path d="M3 8h18" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="1.5" />
      <path d="M11 18h2" />
    </>
  ),
  software: (
    <>
      <path d="M4 7h16v12H4z" />
      <path d="M8 7V5h8v2" />
      <path d="M8 12h8M8 15h5" />
    </>
  ),
  ai: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2M7 7l1.5 1.5M15.5 15.5L17 17M17 7l-1.5 1.5M7 17l1.5-1.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 17h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.4 1.5A3.5 3.5 0 0 0 7 17z" />
    </>
  ),
  design: (
    <>
      <path d="M12 3l2.2 6.4L21 12l-6.8 2.6L12 21l-2.2-6.4L3 12l6.8-2.6z" />
    </>
  ),
  security: (
    <>
      <path d="M12 3l8 3v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6l8-3z" />
    </>
  ),
  consulting: (
    <>
      <path d="M4 19V7l8-3 8 3v12" />
      <path d="M8 19v-6h8v6" />
    </>
  ),
};

export function LineIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
