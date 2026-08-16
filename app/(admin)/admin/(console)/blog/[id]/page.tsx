import { BlogEditPage } from "@/components/admin/pages/blog-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogEditPage id={id} />;
}
