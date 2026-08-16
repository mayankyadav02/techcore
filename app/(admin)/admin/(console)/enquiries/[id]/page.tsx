import { EnquiryDetailPage } from "@/components/admin/pages/enquiries-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EnquiryDetailPage id={id} />;
}
