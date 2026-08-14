import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-navy-900",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function LoadingState({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex items-center justify-center gap-3 py-16 text-sm text-ink-muted"
      role="status"
      aria-live="polite"
    >
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
