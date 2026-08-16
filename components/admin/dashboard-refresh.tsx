"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DashboardRefresh({ generatedAt }: { generatedAt: string }) {
  const router = useRouter();
  const label = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(generatedAt));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs text-ink-subtle">Updated {label}</p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.refresh()}
      >
        Refresh
      </Button>
    </div>
  );
}
