import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  children: ReactNode;
};

export function IconButton({
  label,
  className,
  variant = "ghost",
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={buttonClassName({
        variant,
        size: "sm",
        className: cn("h-10 w-10 px-0", className),
      })}
      {...props}
    >
      {children}
    </button>
  );
}
