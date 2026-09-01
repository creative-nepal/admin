"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import type { ContentPageStatus } from "../types";

const VARIANTS: Record<ContentPageStatus, "default" | "outline" | "secondary"> =
  {
    published: "default",
    draft: "outline",
    archived: "secondary",
  };

export function PageStatusBadge({ status }: { status: ContentPageStatus }) {
  const { t } = useTranslation();

  return (
    <Badge variant={VARIANTS[status]}>
      {t(`ui.admin.content.pageStatus.${status}`)}
    </Badge>
  );
}
