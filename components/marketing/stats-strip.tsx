import { Container } from "@/components/ui/container";

export type PublicStat = {
  value: string;
  label: string;
};

export function formatCountStat(count: number, singular: string, plural: string): PublicStat | null {
  if (count <= 0) return null;
  const display = count >= 10 ? `${count}+` : String(count);
  return {
    value: display,
    label: count === 1 ? singular : plural,
  };
}

export function StatsStrip({ items }: { items: PublicStat[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-y border-line bg-surface-muted">
      <Container>
        <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <li
              key={item.label}
              className="bg-elevated px-3 py-6 text-center sm:py-8"
            >
              <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{item.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
