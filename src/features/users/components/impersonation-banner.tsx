"use client";

import { RiSpyLine } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { authClient } from "@/lib/auth-client";
import { WORKSPACE_URL } from "../constants";
import { useStopImpersonating } from "../mutations";

export function ImpersonationBanner() {
  const { t } = useTranslation();

  const { data: session } = authClient.useSession();
  const stopImpersonating = useStopImpersonating();

  if (!session?.session.impersonatedBy) {
    return null;
  }

  function handleStop() {
    toast.promise(stopImpersonating.mutateAsync(undefined), {
      loading: "Restoring your session...",
      success: "You are back on your own account",
      error: (error) =>
        error instanceof Error ? error.message : "Failed to stop impersonating",
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-warning/10 px-4 py-2 text-sm">
      <span className="flex items-center gap-2">
        <RiSpyLine className="size-4 shrink-0" />
        {t("ui.admin.users.impersonatingAs")}{" "}
        <strong>{session.user.email}</strong>. Admin actions are unavailable
        until you stop.
      </span>
      <span className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<a href={WORKSPACE_URL} />}
        >
          {t("ui.admin.users.openWorkspace")}
        </Button>
        <Button size="sm" onClick={handleStop}>
          {t("ui.admin.users.stopImpersonating")}
        </Button>
      </span>
    </div>
  );
}
