import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import { packages } from "@/lib/content/home";

export function PackageCards() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
      {packages.map((item, index) => (
        <Card
          key={item.name}
          interactive
          className={cn(
            "group relative flex h-full min-w-0 flex-col overflow-hidden p-5 transition-all duration-300 sm:p-7",
            "hover:-translate-y-1 hover:shadow-[0_18px_45px_rgb(0_200_120_/_0.10)]",
            item.featured &&
              "border-brand/50 ring-1 ring-brand/30 shadow-[0_12px_35px_rgb(0_200_120_/_0.08)]",
          )}
        >
          {/* Premium top accent */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-bright to-teal-400 transition-transform duration-300 group-hover:scale-x-100",
              item.featured && "scale-x-100",
            )}
            aria-hidden="true"
          />
          {/* Package header */}
<div className="flex min-h-10 items-center justify-between gap-3">
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/8 text-sm font-semibold tabular-nums text-brand-dark transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white">
    {String(index + 1).padStart(2, "0")}
  </span>

  {item.featured ? (
    <span className="shrink-0 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-brand-dark uppercase">
      Recommended
    </span>
  ) : null}
</div>

          {/* Package identity */}
          <p className="mt-6 text-xs font-medium tracking-[0.16em] text-brand-dark uppercase">
            {item.name}
          </p>

          <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
            {item.audience}
          </p>

          <p className="mt-3 text-sm leading-6 text-ink-muted">
            {item.summary}
          </p>

          {/* Includes */}
          <div className="mt-6 border-t border-ink/8 pt-5">
            <p className="mb-3 text-xs font-medium tracking-[0.12em] text-ink-subtle uppercase">
              Typically includes
            </p>

            <ul className="space-y-2.5 text-sm text-ink">
              {item.includes.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span
                    className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[0.6rem] text-brand-dark"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <ButtonLink
              href="/quote"
              variant={item.featured ? "primary" : "outline"}
              className="min-h-11 w-full transition-all duration-200"
            >
              Custom Quote
            </ButtonLink>
          </div>
        </Card>
      ))}
    </div>
  );
}