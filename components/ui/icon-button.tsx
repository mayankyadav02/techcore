import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "inverse";
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      label,
      className,
      variant = "ghost",
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={buttonClassName({
          variant,
          size: "sm",
          className: cn("h-11 w-11 px-0 hover:translate-y-0 hover:scale-100", className),
        })}
        {...props}
      >
        {children}
      </button>
    );
  },
);
