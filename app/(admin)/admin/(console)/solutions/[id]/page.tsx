import { SolutionEditPage } from "@/components/admin/pages/solutions-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SolutionEditPage id={id} />;
}
