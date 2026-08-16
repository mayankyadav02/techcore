import Link from "next/link";
import { LineIcon } from "@/components/marketing/line-icon";
import { Card } from "@/components/ui/card";

import type { Service } from "@/lib/content/services";

export function ServiceCard({
  service,
}: {
  service: Service;
}) {
  return (
<Card
  interactive
  className="group flex h-full min-w-0 flex-col items-center p-6 text-center"
>
  <span
    className="
      flex h-16 w-16 items-center justify-center
      rounded-2xl
      border border-brand/15
      bg-brand/10
      text-brand-dark
      transition-all duration-300
      group-hover:scale-110
      group-hover:bg-brand
      group-hover:text-white
      group-hover:shadow-[0_12px_35px_rgba(0,200,120,0.22)]
    "
  >
    <LineIcon
      name={service.icon}
      className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
    />
  </span>

  <h3 className="mt-5 text-[1.2rem] font-semibold text-ink">
    <Link
      href={`/services/${service.slug}`}
      className="transition-colors hover:text-brand-dark"
    >
      {service.title}
    </Link>
  </h3>

  <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
    {service.summary}
  </p>

  {service.capabilities.length > 0 ? (
    <ul className="mt-5 w-full space-y-2 text-left text-sm text-ink">
      {service.capabilities.slice(0, 3).map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  ) : null}

  <Link
    href={`/services/${service.slug}`}
    className="
      mt-6 inline-flex min-h-11 items-center
      text-sm font-medium
      text-brand-dark
      transition-colors
      hover:text-brand
      hover:underline
    "
  >
    Explore Service
  </Link>
</Card>
  );
}