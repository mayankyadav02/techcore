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
    <Card className="p-5">
      <p className="text-xs font-medium tracking-wide text-ink-subtle uppercase">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-navy-900">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-ink-muted">{hint}</p> : null}
    </Card>
  );
}
