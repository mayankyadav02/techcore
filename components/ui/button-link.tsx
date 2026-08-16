import Link from "next/link";
import { buttonClassName, type ButtonVariant } from "@/components/ui/button";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName({ variant, size, className })} onClick={onClick}>
      {children}
    </Link>
  );
}
