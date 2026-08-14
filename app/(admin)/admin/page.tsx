import { Breadcrumb } from "@/components/admin/breadcrumb";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <PageHeader
        title="Dashboard"
        description="Operational counts will appear here once content and leads are connected."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="New enquiries" value="—" hint="Leads module pending" />
        <DashboardCard label="Applications" value="—" hint="Careers module pending" />
        <DashboardCard label="Draft content" value="—" hint="CMS pending" />
        <DashboardCard label="Published pages" value="—" hint="CMS pending" />
      </div>
      <EmptyState
        title="No live activity yet"
        description="Enquiry and application tables will populate after identity and content phases."
      />
    </div>
  );
}
