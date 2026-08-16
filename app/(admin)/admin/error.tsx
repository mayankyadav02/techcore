"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function AdminError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <ErrorState title="Admin view failed to load" />
      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium text-ink underline"
      >
        Try again
      </button>
    </div>
  );
}
