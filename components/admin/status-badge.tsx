import { Badge } from "@/components/ui/badge";

const tones: Record<string, "neutral" | "brand" | "navy" | "success" | "warning"> =
  {
    draft: "neutral",
    published: "success",
    archived: "neutral",
    open: "success",
    closed: "warning",
    new: "brand",
    contacted: "navy",
    qualified: "navy",
    in_progress: "warning",
    converted: "success",
    reviewing: "navy",
    shortlisted: "success",
    rejected: "warning",
    hired: "success",
  };

export function StatusBadge({ status }: { status: string }) {
  const label = status.replaceAll("_", " ");
  return <Badge tone={tones[status] ?? "neutral"}>{label}</Badge>;
}
