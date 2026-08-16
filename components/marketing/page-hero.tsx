import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 text-white">
      <div className="tc-hero-mesh absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <Container className="relative pt-[calc(var(--header-height)+2.25rem)] pb-12 sm:pb-20 lg:pb-24">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-[0.18em] text-brand-bright uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "mt-4 max-w-3xl text-[clamp(1.85rem,3.6vw,2.75rem)] font-semibold tracking-tight break-words leading-[1.15]",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row [&>a]:w-full sm:[&>a]:w-auto">{actions}</div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
