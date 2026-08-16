import Link from "next/link";
import { CoverMedia } from "@/components/marketing/cover-media";
import { Card } from "@/components/ui/card";
import { catalogImage } from "@/lib/public-images";
import { cn } from "@/lib/utils";

export function IndustryGrid({
  industries,
  className,
}: {
  industries: { slug: string; title: string; summary: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {industries.map((item, index) => {
        const image = catalogImage("industries", item.slug);

        return (
          <li key={item.slug} className="group">
            <Card
              interactive
              className="
                relative flex h-full min-w-0 flex-col overflow-hidden p-0
                border-line bg-elevated
                transition-all duration-300
                group-hover:-translate-y-1
                group-hover:border-brand/25
                group-hover:shadow-[var(--shadow-md)]
              "
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <CoverMedia
                  src={image}
                  alt={item.title}
                  className="
                    rounded-none
                    transition-transform duration-500
                    group-hover:scale-[1.035]
                  "
                />

                {/* subtle image overlay */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-t from-navy-950/30 via-transparent to-transparent
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Industry number */}
                <span
                  className="
                    absolute top-3 left-3
                    rounded-lg border border-white/15
                    bg-navy-950/55 px-2.5 py-1.5
                    text-[0.65rem] font-medium tracking-[0.14em]
                    text-white backdrop-blur-md
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">
                  <Link
                    href={`/industries/${item.slug}`}
                    className="transition-colors duration-200 hover:text-brand-dark"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                  {item.summary}
                </p>

                <Link
                  href={`/industries/${item.slug}`}
                  className="
                    group/link mt-5 inline-flex min-h-11 w-fit
                    items-center gap-2
                    text-sm font-medium text-brand-dark
                    transition-colors duration-200
                    hover:text-brand
                  "
                >
                  Explore Industry
                  <span
                    aria-hidden="true"
                    className="
                      transition-transform duration-200
                      group-hover/link:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Bottom accent */}
              <div
                aria-hidden="true"
                className="
                  absolute inset-x-0 bottom-0 h-0.5
                  origin-left scale-x-0 bg-brand
                  transition-transform duration-300
                  group-hover:scale-x-100
                "
              />
            </Card>
          </li>
        );
      })}
    </ul>
  );
}