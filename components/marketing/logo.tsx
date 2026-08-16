import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const sizes = {
  sm: { className: "h-8 w-auto max-w-[8.25rem] sm:max-w-[9.5rem]", width: 148, height: 37 },
  md: {
    className:
      "h-8 w-auto max-w-[8.75rem] sm:h-9 sm:max-w-[10.15rem] lg:h-10 lg:max-w-[11.75rem]",
    width: 180,
    height: 45,
  },
  lg: { className: "h-10 w-auto max-w-[10.5rem] sm:h-11 sm:max-w-[11.75rem]", width: 188, height: 47 },
} as const;

export function Logo({
  inverted = false,
  className,
  name = site.name,
  size = "md",
  priority = false,
}: {
  inverted?: boolean;
  className?: string;
  name?: string;
  size?: keyof typeof sizes;
  priority?: boolean;
}) {
  const dim = sizes[size];
  const imageClass = cn(
    dim.className,
    "object-contain object-left",
  );

  return (
    <Link
      href="/"
      aria-label={name}
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center rounded-[var(--radius-sm)] transition-[transform,box-shadow] duration-200 hover:scale-[1.03] hover:shadow-[0_0_22px_rgb(0_200_120_/_0.28)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none",
        className,
      )}
    >
      {inverted ? (
        <Image
          src="/logo.dark.png"
          alt={name}
          width={dim.width}
          height={dim.height}
          priority={priority}
          className={imageClass}
        />
      ) : (
        <>
          <Image
            src="/logo.light.png"
            alt={name}
            width={dim.width}
            height={dim.height}
            priority={priority}
            className={cn(imageClass, "dark:hidden")}
          />
          <Image
            src="/logo.dark.png"
            alt=""
            width={dim.width}
            height={dim.height}
            priority={priority}
            aria-hidden="true"
            className={cn(imageClass, "hidden dark:block")}
          />
        </>
      )}
    </Link>
  );
}
