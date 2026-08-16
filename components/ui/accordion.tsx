export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-elevated">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="min-h-11 cursor-pointer list-none px-4 py-3.5 text-sm font-medium text-ink marker:hidden focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-4">
              {item.title}
              <span aria-hidden="true" className="text-ink-subtle group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden text-ink-subtle group-open:inline">
                −
              </span>
            </span>
          </summary>
          <div className="accordion-panel px-4 pb-4 text-sm leading-6 text-ink-muted">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
