import { ProjectsListPage } from "@/components/admin/pages/projects-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <ProjectsListPage searchParams={searchParams} />;
}
