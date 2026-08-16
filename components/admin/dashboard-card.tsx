import { Card } from "@/components/ui/card";

export function DashboardCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="border-l-2 border-l-brand p-5">
      <p className="text-xs font-medium tracking-wide text-ink-subtle uppercase">
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-ink-muted">{hint}</p> : null}
    </Card>
  );
}
