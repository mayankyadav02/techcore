import Image from "next/image";
import { LineIcon } from "@/components/marketing/line-icon";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/content/services";

export function CoverMedia({
  src,
  alt,
  icon,
  className,
}: {
  src: string | null;
  alt: string;
  icon?: IconName;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-[var(--radius-md)] bg-navy-900",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0" aria-hidden="true">
          <div className="tc-hero-mesh absolute inset-0 opacity-90" />
          {icon ? (
            <span className="absolute inset-0 flex items-center justify-center text-white/80">
              <LineIcon name={icon} className="h-10 w-10" />
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
