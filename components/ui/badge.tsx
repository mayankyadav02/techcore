import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "navy" | "success" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-muted",
  brand: "bg-brand/10 text-brand-dark",
  navy: "bg-navy-900/8 text-navy-900",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
