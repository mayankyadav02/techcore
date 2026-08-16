import { Card } from "@/components/ui/card";
import type { PublicTestimonial } from "@/lib/public-mappers";

export function TestimonialGrid({ items }: { items: PublicTestimonial[] }) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={`${item.name}-${item.role}`}
          interactive
          className="
            group relative flex h-full min-w-0 flex-col overflow-hidden
            p-6 sm:p-7
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          {/* Subtle emerald glow */}
          <div
            className="
              pointer-events-none absolute -right-16 -top-16
              h-32 w-32 rounded-full
              bg-brand/10 blur-3xl
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100
            "
            aria-hidden="true"
          />

          {/* Quote mark */}
          <div
            className="
              relative flex h-11 w-11 items-center justify-center
              rounded-[var(--radius-md)]
              border border-brand/20
              bg-brand/8
              text-2xl font-semibold leading-none
              text-brand-dark
              transition-all duration-300
              group-hover:border-brand/40
              group-hover:bg-brand/12
              group-hover:scale-105
            "
            aria-hidden="true"
          >
            “
          </div>

          {/* Label */}
          <p className="relative mt-5 text-[0.65rem] font-medium tracking-[0.16em] text-brand-dark uppercase">
            Fictional reference
          </p>

          {/* Quote */}
          <blockquote className="relative mt-4 flex flex-1 flex-col">
            <p className="text-[0.95rem] leading-7 text-ink">
              “{item.quote}”
            </p>

            {/* Author */}
            <footer className="mt-7 border-t border-line pt-5">
              <cite className="not-italic text-sm font-semibold text-ink">
                {item.name}
              </cite>

              <span className="mt-1 block text-xs leading-5 text-ink-muted">
                {item.role}
              </span>
            </footer>
          </blockquote>
        </Card>
      ))}
    </div>
  );
}