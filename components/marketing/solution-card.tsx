import Link from "next/link";
import { CoverMedia } from "@/components/marketing/cover-media";
import { Card } from "@/components/ui/card";
import { catalogImage } from "@/lib/public-images";
export function SolutionCard({
  item,
}: {
  item: { slug: string; title: string; summary: string };
}) {
  const image = catalogImage("solutions", item.slug);

  return (
    <Card interactive className="flex h-full flex-col overflow-hidden p-0">
      <CoverMedia src={image} alt={item.title} icon="software" className="rounded-none" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.25rem] font-semibold text-ink">
          <Link href={`/solutions/${item.slug}`} className="hover:text-brand-dark">
            {item.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{item.summary}</p>
        <Link
          href={`/solutions/${item.slug}`}
          className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
        >
          View Solution
        </Link>
      </div>
    </Card>
  );
}
