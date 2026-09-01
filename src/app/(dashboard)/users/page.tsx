import { Suspense } from "react";
import { ViewSkeleton } from "@/components/view-skeleton";
import { UsersView } from "@/features/users/views/users-view";

export default function UsersPage() {
  return (
    <Suspense fallback={<ViewSkeleton />}>
      <UsersView />
    </Suspense>
  );
}
