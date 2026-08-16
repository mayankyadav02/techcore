import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-line bg-elevated px-3 py-2.5 text-base text-ink placeholder:text-ink-subtle transition-colors duration-150 hover:border-line-strong focus-visible:border-brand-dark disabled:cursor-not-allowed disabled:bg-surface-muted md:text-sm";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-32 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, "h-11", className)} {...props}>
      {children}
    </select>
  );
}

export { fieldClass };
