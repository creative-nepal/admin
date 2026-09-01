import { Suspense } from "react";
import { ViewSkeleton } from "@/components/view-skeleton";
import { BusinessesView } from "@/features/businesses/views/businesses-view";

export default function BusinessesPage() {
  return (
    <Suspense fallback={<ViewSkeleton />}>
      <BusinessesView />
    </Suspense>
  );
}
