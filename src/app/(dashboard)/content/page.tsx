import { Suspense } from "react";
import { ViewSkeleton } from "@/components/view-skeleton";
import { ContentPagesView } from "@/features/content/views/content-pages-view";

export default function ContentPage() {
  return (
    <Suspense fallback={<ViewSkeleton />}>
      <ContentPagesView />
    </Suspense>
  );
}
