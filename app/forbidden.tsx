export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-ink-subtle">403</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">
        You do not have access
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        This area of the CMS is limited to roles that need it.
      </p>
    </div>
  );
}
