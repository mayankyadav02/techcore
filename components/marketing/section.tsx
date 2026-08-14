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
    light: "bg-white text-ink",
    muted: "bg-surface text-ink",
    dark: "bg-navy-900 text-white",
  };

  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}
