import { BlogListPage } from "@/components/admin/pages/blog-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <BlogListPage searchParams={searchParams} />;
}
