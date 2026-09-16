"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useDirtyState } from "@/components/admin/dirty-state-provider";
import type { ActionResult } from "@/lib/admin/action";

export function MutationForm({
  action,
  children,
  submitLabel,
  className,
  onSuccessPath,
  onClosePath,
  onContinuePath,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  onSuccessPath?: string | ((id: string) => string);
  onClosePath?: string | ((id: string) => string);
  onContinuePath?: string | ((id: string) => string);
}) {
  const router = useRouter();
  const { notify } = useToast();
  const { setDirty } = useDirtyState();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitIntent, setSubmitIntent] = useState<"close" | "continue" | "default">("default");

  return (
    <form
      className={className ?? "space-y-6"}
      onChange={() => setDirty(true)}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const intent = submitIntent; // capture current state
        
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
          
          // CRITICAL: clear dirty state before any navigation
          setDirty(false);
          
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

          // Determine paths based on intent
          if (intent === "close" && onClosePath) {
            const path = typeof onClosePath === "function" && savedId ? onClosePath(savedId) : (typeof onClosePath === "string" ? onClosePath : null);
            if (path) {
              router.push(path);
              return;
            }
          }
          
          if (intent === "continue" && onContinuePath) {
            const path = typeof onContinuePath === "function" && savedId ? onContinuePath(savedId) : (typeof onContinuePath === "string" ? onContinuePath : null);
            if (path) {
              // Using replace for "Save & Continue" so we don't spam history stack
              // But only if we actually need to change the URL (e.g. after a create)
              const currentPath = window.location.pathname;
              if (currentPath !== path) {
                router.replace(path);
              } else {
                router.refresh();
              }
              return;
            }
          }

          // Fallback to legacy onSuccessPath behavior if dual intents weren't used
          if (typeof onSuccessPath === "function" && savedId) {
            router.push(onSuccessPath(savedId));
          } else if (typeof onSuccessPath === "string") {
            router.push(onSuccessPath);
          } else {
            router.refresh();
          }
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
      
      <div className="flex flex-wrap items-center gap-3">
        {onClosePath || onContinuePath ? (
          <>
            <Button
              type="submit"
              disabled={pending}
              onClick={() => setSubmitIntent("close")}
            >
              {pending && submitIntent === "close" ? "Saving…" : "Save & Close"}
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={pending}
              onClick={() => setSubmitIntent("continue")}
            >
              {pending && submitIntent === "continue" ? "Saving…" : "Save & Continue"}
            </Button>
          </>
        ) : (
          <Button 
            type="submit" 
            disabled={pending}
            onClick={() => setSubmitIntent("default")}
          >
            {pending ? "Saving…" : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
