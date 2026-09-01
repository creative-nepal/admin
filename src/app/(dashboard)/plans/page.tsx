import { Suspense } from "react";
import { ViewSkeleton } from "@/components/view-skeleton";
import { PlansView } from "@/features/plans/views/plans-view";

export default function PlansPage() {
  return (
    <Suspense fallback={<ViewSkeleton />}>
      <PlansView />
    </Suspense>
  );
}
