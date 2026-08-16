import Link from "next/link";
import { LineIcon } from "@/components/marketing/line-icon";
import type { Service } from "@/lib/content/services";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <article className="grid gap-6 border-t border-line py-10 md:grid-cols-[2.5rem_1fr_10rem] md:gap-10">
      <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-brand/10 text-brand-dark">
        <LineIcon name={service.icon} />
      </span>
      <div>
        <h3 className="text-xl font-semibold text-ink">
          <Link href={`/services/${service.slug}`} className="hover:text-brand-dark">
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          {service.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
          {service.capabilities.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="md:self-center md:justify-self-end">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
        >
          Explore Service
        </Link>
      </div>
    </article>
  );
}
