import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "on-dark"
  | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-navy-950 hover:bg-brand-bright shadow-[0_8px_22px_rgb(0_200_120_/_0.28)]",
  secondary: "tc-gradient text-navy-950 hover:opacity-95 shadow-[0_8px_22px_rgb(0_200_120_/_0.22)]",
  outline:
    "border border-line-strong bg-elevated text-ink hover:border-brand hover:bg-surface-muted",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-danger text-white hover:bg-danger/90",
  "on-dark":
    "border border-white/20 bg-transparent text-white hover:border-white/55 hover:bg-white/8",
  inverse:
    "border border-white/20 bg-transparent text-white hover:border-white/55 hover:bg-white/8",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[0.9375rem]",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-[color,background-color,border-color,transform,opacity,box-shadow] duration-150 touch-manipulation hover:-translate-y-1 hover:scale-[1.02] hover:opacity-[0.97] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:active:scale-100 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
