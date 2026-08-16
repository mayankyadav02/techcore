"use client";

import { useRouter } from "next/navigation";
import { ConfirmAction } from "@/components/admin/confirm-action";
import type { ActionResult } from "@/lib/admin/action";

export function RefreshConfirm({
  label,
  title,
  description,
  confirmLabel,
  variant,
  action,
  redirectTo,
}: {
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "outline" | "danger" | "ghost";
  action: () => Promise<ActionResult>;
  redirectTo?: string;
}) {
  const router = useRouter();
  return (
    <ConfirmAction
      label={label}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant={variant}
      action={action}
      onSuccess={() => {
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      }}
    />
  );
}
