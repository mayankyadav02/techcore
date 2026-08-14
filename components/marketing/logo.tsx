import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({
  inverted = false,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight",
        inverted ? "text-white" : "text-navy-900",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-8 w-8 items-center justify-center text-[0.7rem] font-semibold",
          inverted ? "bg-white text-navy-900" : "bg-navy-900 text-white",
        )}
      >
        TC
      </span>
      <span>{site.name}</span>
    </Link>
  );
}
