import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  const max =
    width === "wide"
      ? "max-w-[80rem]"
      : width === "narrow"
        ? "max-w-3xl"
        : "max-w-[72rem]";

  return (
    <div className={cn("mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8", max, className)}>
      {children}
    </div>
  );
}
