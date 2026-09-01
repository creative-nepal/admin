import { BusinessDetailView } from "@/features/businesses/views/business-detail-view";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BusinessDetailView businessId={id} />;
}
