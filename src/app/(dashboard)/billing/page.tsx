import { Suspense } from "react";
import { ViewSkeleton } from "@/components/view-skeleton";
import { BillingView } from "@/features/billing/views/billing-view";

export default function BillingPage() {
  return (
    <Suspense fallback={<ViewSkeleton />}>
      <BillingView />
    </Suspense>
  );
}
