"use client";

import { useQuery } from "@tanstack/react-query";
import { ContentDialog } from "@/components/composed/content-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatDateTime } from "@/lib/formatters";
import { userQueryOptions } from "../queries";
import type { AdminUser } from "../types";
import { UserRoleBadge } from "./user-role-badge";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  );
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    ...userQueryOptions(user.id),
    enabled: open,
  });

  const current = data ?? user;

  return (
    <ContentDialog
      open={open}
      onOpenChange={onOpenChange}
      title={current.name}
      description={t("ui.admin.users.detailsHint")}
    >
      {isLoading && !data ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="divide-y">
          <Row label={t("ui.admin.users.userId")}>
            <code className="text-xs">{current.id}</code>
          </Row>
          <Row label={t("ui.field.email")}>{current.email}</Row>
          <Row label={t("ui.admin.users.emailVerified")}>
            {current.emailVerified ? (
              <Badge variant="outline">{t("ui.admin.users.verified")}</Badge>
            ) : (
              <Badge variant="secondary">
                {t("ui.admin.users.unverified")}
              </Badge>
            )}
          </Row>
          <Row label={t("ui.field.role")}>
            <UserRoleBadge role={current.role} />
          </Row>
          <Row label={t("ui.field.status")}>
            {current.banned ? (
              <Badge variant="destructive">{t("ui.admin.users.banned")}</Badge>
            ) : (
              <Badge variant="outline">{t("common.status.active")}</Badge>
            )}
          </Row>
          {current.banned && current.banReason && (
            <Row label={t("ui.admin.users.banReason")}>{current.banReason}</Row>
          )}
          {current.banned && (
            <Row label={t("ui.admin.users.banExpires")}>
              {current.banExpires
                ? formatDateTime(current.banExpires)
                : "Never"}
            </Row>
          )}
          <Row label={t("ui.field.joined")}>
            {formatDateTime(current.createdAt)}
          </Row>
          <Row label={t("ui.admin.users.lastUpdated")}>
            {formatDateTime(current.updatedAt)}
          </Row>
        </div>
      )}
    </ContentDialog>
  );
}
