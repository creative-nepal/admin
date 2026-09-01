"use client";

import { RiComputerLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState } from "@/components/composed/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatDateTime } from "@/lib/formatters";
import { useRevokeUserSession, useRevokeUserSessions } from "../mutations";
import { userSessionsQueryOptions } from "../queries";
import type { AdminUser } from "../types";

interface UserSessionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}

export function UserSessionsSheet({
  open,
  onOpenChange,
  user,
}: UserSessionsSheetProps) {
  const { t } = useTranslation();

  const { data: sessions, isLoading } = useQuery(
    userSessionsQueryOptions(user.id, open),
  );
  const revokeSession = useRevokeUserSession();
  const revokeAll = useRevokeUserSessions();

  function handleRevoke(sessionToken: string) {
    toast.promise(revokeSession.mutateAsync({ sessionToken }), {
      loading: "Revoking session...",
      success: "Session revoked",
      error: (error) =>
        error instanceof Error ? error.message : "Failed to revoke session",
    });
  }

  function handleRevokeAll() {
    toast.promise(revokeAll.mutateAsync({ userId: user.id }), {
      loading: "Revoking sessions...",
      success: `${user.name} has been signed out everywhere`,
      error: (error) =>
        error instanceof Error ? error.message : "Failed to revoke sessions",
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("ui.admin.users.activeSessions")}</SheetTitle>
          <SheetDescription>
            Every device {user.name} is currently signed in on.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-2">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <RiComputerLine className="size-4 shrink-0" />
                    <span className="truncate">
                      {session.ipAddress || "Unknown address"}
                    </span>
                    {session.impersonatedBy && (
                      <Badge variant="outline">
                        {t("ui.admin.users.impersonated")}
                      </Badge>
                    )}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session.userAgent || "Unknown device"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Expires {formatDateTime(session.expiresAt)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(session.token)}
                >
                  {t("ui.action.revoke")}
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              title={t("ui.admin.users.sessionsEmptyTitle")}
              description={t("ui.admin.users.sessionsEmptyBody")}
            />
          )}
        </div>
        <SheetFooter>
          <Button
            variant="destructive"
            disabled={!sessions || sessions.length === 0}
            onClick={handleRevokeAll}
          >
            {t("ui.admin.users.revokeAll")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
