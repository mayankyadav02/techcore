"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-5 py-24">
      <ErrorState
        title="The page could not be loaded"
        description="An unexpected error occurred. You can retry, or return to the homepage."
      />
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-ink underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
