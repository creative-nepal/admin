"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { SECTOR_LABELS } from "../constants";
import type { BusinessStatus, Sector, SubscriptionStatus } from "../types";

export function SectorBadge({ sector }: { sector: Sector }) {
  return <Badge variant="secondary">{SECTOR_LABELS[sector] ?? sector}</Badge>;
}

export function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  const { t } = useTranslation();

  if (status === "active") {
    return <Badge variant="outline">{t("common.status.active")}</Badge>;
  }

  if (status === "suspended") {
    return <Badge variant="destructive">{t("common.status.suspended")}</Badge>;
  }

  return <Badge variant="secondary">{t("common.status.closed")}</Badge>;
}

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  const { t } = useTranslation();

  if (status === "active") {
    return <Badge>{t("common.status.active")}</Badge>;
  }

  if (status === "trialing") {
    return <Badge variant="secondary">{t("common.status.trialing")}</Badge>;
  }

  if (status === "past_due") {
    return (
      <Badge variant="destructive">{t("ui.admin.overview.pastDue")}</Badge>
    );
  }

  return <Badge variant="outline">{t("common.status.canceled")}</Badge>;
}
