export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="cursor-pointer list-none py-4 text-sm font-medium text-ink marker:hidden focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
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
          <div className="pb-4 text-sm text-ink-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
