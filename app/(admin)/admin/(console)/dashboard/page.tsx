import Link from "next/link";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { DashboardRefresh } from "@/components/admin/dashboard-refresh";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBars } from "@/components/charts/status-bars";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requirePagePermission } from "@/lib/auth";
import { loadDashboard } from "@/modules/identity/dashboard.service";

function formatWhen(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const user = await requirePagePermission("dashboard:read");
  const data = await loadDashboard(user);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <PageHeader
        title="Dashboard"
        description="A snapshot of catalogue, leads, and hiring activity. Counts come from stored records — not live traffic."
        actions={<DashboardRefresh generatedAt={data.generatedAt} />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.canReadLeads ? (
          <>
            <DashboardCard
              label="Total enquiries"
              value={String(data.counts.enquiries)}
            />
            <DashboardCard
              label="New enquiries"
              value={String(data.counts.newEnquiries)}
              hint="Awaiting first response"
            />
          </>
        ) : null}
        <DashboardCard label="Projects" value={String(data.counts.projects)} />
        <DashboardCard label="Services" value={String(data.counts.services)} />
        <DashboardCard label="Blog posts" value={String(data.counts.posts)} />
        <DashboardCard
          label="Active jobs"
          value={String(data.counts.jobs)}
          hint="Open roles"
        />
        {data.canReadLeads ? (
          <DashboardCard
            label="Applications"
            value={String(data.counts.applications)}
          />
        ) : null}
      </div>
      {data.canReadLeads ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <StatusBars
              title="Enquiries by status"
              emptyTitle="No enquiry data available yet."
              items={data.enquiryByStatus}
            />
            <StatusBars
              title="Applications by status"
              emptyTitle="No application data available yet."
              items={data.applicationByStatus}
            />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="p-0">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-sm font-semibold text-ink">
                  Recent enquiries
                </h2>
                <Link
                  href="/admin/enquiries"
                  className="text-sm font-medium text-ink hover:underline"
                >
                  View all
                </Link>
              </div>
              {data.recentEnquiries.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="No enquiries yet"
                    description="Contact and quote submissions will appear here."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {data.recentEnquiries.map((item) => (
                    <li key={item.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        {item.type} · {item.status} · {formatWhen(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-0">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-sm font-semibold text-ink">
                  Recent applications
                </h2>
                <Link
                  href="/admin/applications"
                  className="text-sm font-medium text-ink hover:underline"
                >
                  View all
                </Link>
              </div>
              {data.recentApplications.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    title="No applications yet"
                    description="Job applications will appear here."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {data.recentApplications.map((item) => (
                    <li key={item.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        {item.role} · {item.status} · {formatWhen(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      ) : (
        <EmptyState
          title="Lead queues are restricted"
          description="Your role can manage published content. Enquiry and application details are limited to admins."
        />
      )}
    </div>
  );
}
