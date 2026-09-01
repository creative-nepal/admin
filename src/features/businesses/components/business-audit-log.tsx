"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState } from "@/components/composed/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatDateTime } from "@/lib/formatters";
import { businessAuditLogQueryOptions } from "../queries";

const PAGE_SIZE = 20;

const ACTION_LABELS: Record<string, string> = {
  issued: "Invoice issued",
  printed: "Printed",
  credit_note_issued: "Credit note issued",
  cbms_pushed: "CBMS pushed",
  cbms_failed: "CBMS failed",
};

export function BusinessAuditLog({ businessId }: { businessId: string }) {
  const { t } = useTranslation();

  const [pageIndex, setPageIndex] = useState(0);
  const { data, isFetching } = useQuery(
    businessAuditLogQueryOptions(businessId, pageIndex, PAGE_SIZE),
  );

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasNext = (pageIndex + 1) * PAGE_SIZE < total;

  if (!isFetching && rows.length === 0) {
    return (
      <EmptyState
        title={t("ui.admin.businesses.auditEmptyTitle")}
        description={t("ui.admin.businesses.auditEmptyBody")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("ui.field.when")}</TableHead>
            <TableHead>{t("ui.field.action")}</TableHead>
            <TableHead>{t("ui.field.invoice")}</TableHead>
            <TableHead>{t("ui.field.actor")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(entry.createdAt)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    entry.action === "cbms_failed" ? "destructive" : "outline"
                  }
                >
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">
                #{entry.invoiceNumber}
                <span className="text-muted-foreground text-xs">
                  {" "}
                  ({entry.fiscalYear})
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {entry.actorName ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {total} {total === 1 ? "entry" : "entries"}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((index) => Math.max(index - 1, 0))}
          >
            {t("ui.action.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext}
            onClick={() => setPageIndex((index) => index + 1)}
          >
            {t("ui.action.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
