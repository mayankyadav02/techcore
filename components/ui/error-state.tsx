export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, contact the TechCore team.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      className="border border-line bg-elevated px-6 py-14 text-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
    </div>
  );
}
