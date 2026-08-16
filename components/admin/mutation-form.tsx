"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/admin/action";

export function MutationForm({
  action,
  children,
  submitLabel,
  className,
  onSuccessPath,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  onSuccessPath?: string | ((id: string) => string);
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  return (
    <form
      className={className ?? "space-y-6"}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setError(null);
        setFieldErrors({});
        startTransition(async () => {
            const result = await action(data);
          if (!result.ok) {
            setError(result.message);
            setFieldErrors(result.fields ?? {});
            notify({
              title: "Could not save",
              description: result.message,
              tone: "danger",
            });
            return;
          }
          notify({
            title: result.message ?? "Saved",
            tone: "success",
          });
          const savedId =
            result.data &&
            typeof result.data === "object" &&
            "id" in result.data &&
            typeof result.data.id === "string"
              ? result.data.id
              : undefined;
          if (typeof onSuccessPath === "function" && savedId) {
            router.push(onSuccessPath(savedId));
          } else if (typeof onSuccessPath === "string") {
            router.push(onSuccessPath);
          }
          router.refresh();
        });
      }}
    >
      {Object.keys(fieldErrors).length ? (
        <ul className="space-y-1 text-sm text-danger" role="alert">
          {Object.entries(fieldErrors).map(([name, message]) => (
            <li key={name}>{message}</li>
          ))}
        </ul>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
