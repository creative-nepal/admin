"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/features/i18n/hooks/use-translation";

export function UserRoleBadge({ role }: { role?: string | string[] | null }) {
  const { t } = useTranslation();

  const value = Array.isArray(role) ? role[0] : role;

  if (!value || value === "user") {
    return <Badge variant="outline">{t("ui.admin.users.roleUser")}</Badge>;
  }

  if (value === "admin") {
    return <Badge>{t("ui.admin.users.roleAdmin")}</Badge>;
  }

  return <Badge variant="secondary">{value}</Badge>;
}
