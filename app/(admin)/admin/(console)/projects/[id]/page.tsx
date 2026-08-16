import { ProjectEditPage } from "@/components/admin/pages/projects-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectEditPage id={id} />;
}
