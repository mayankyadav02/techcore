import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "muted" | "dark";
}) {
  const tones = {
    light: "bg-elevated text-ink",
    muted: "bg-surface-muted text-ink",
    dark: "tc-hero-mesh text-white",
  };

  return (
    <section className={cn("py-12 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}
