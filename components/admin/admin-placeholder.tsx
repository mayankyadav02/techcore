import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: title }]} />
      <PageHeader title={title} description={description} />
      <EmptyState
        title="CRUD is not enabled in this phase"
        description="This screen establishes the admin workspace. Records, forms, and publishing come next."
      />
    </div>
  );
}
