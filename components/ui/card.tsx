import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-elevated p-6 shadow-[var(--shadow-sm)]",
        interactive && "card-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
