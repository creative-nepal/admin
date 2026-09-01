"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composed/confirm-dialog";
import { EmptyState } from "@/components/composed/empty-state";
import { PageHeader } from "@/components/composed/page-header";
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
import { StatTile } from "@/features/businesses/components/stat-tile";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { billingQueryKeys, platformInvoicesQueryOptions } from "../queries";
import { consolidate, runBilling } from "../services";

function money(cents: number): string {
  return formatCurrency(cents / 100, "NPR");
}

export function BillingView() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState<"run" | "consolidate" | null>(
    null,
  );

  const { data } = useQuery(platformInvoicesQueryOptions());

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: billingQueryKeys.all });

  const run = useMutation({
    mutationFn: runBilling,
    onSuccess: (summary) => {
      void invalidate();
      toast.success(
        `Examined ${summary.examined}, charged ${summary.charged}, failed ${summary.failed}, ${summary.skippedNoPaymentMethod} without a payment method, ${summary.suspended} suspended`,
      );
    },
    onError: () => toast.error(t("ui.admin.billing.runFailed")),
  });

  const close = useMutation({
    mutationFn: consolidate,
    onSuccess: (result) => {
      void invalidate();
      toast.success(`${result.closed} invoice(s) consolidated and numbered`);
    },
  });

  const totals = data?.totals ?? {};
  const open = totals.open ?? { count: 0, cents: 0 };
  const paid = totals.paid ?? { count: 0, cents: 0 };
  const draft = totals.draft ?? { count: 0, cents: 0 };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.billing.title")}
        description={t("ui.admin.billing.description")}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirming("consolidate")}
            >
              {t("ui.admin.billing.consolidate")}
            </Button>
            <Button onClick={() => setConfirming("run")}>
              {t("ui.admin.billing.run")}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={t("ui.admin.billing.accruing")}
          value={money(draft.cents)}
          hint={`${draft.count} open period(s)`}
        />
        <StatTile
          label={t("ui.admin.billing.issuedUnpaid")}
          value={money(open.cents)}
          hint={`${open.count} invoice(s)`}
          tone={open.count > 0 ? "danger" : "default"}
        />
        <StatTile
          label={t("ui.admin.billing.paid")}
          value={money(paid.cents)}
          hint={`${paid.count} invoice(s)`}
        />
        <StatTile
          label={t("ui.admin.billing.totalInvoices")}
          value={data?.total ?? 0}
        />
      </div>

      {(data?.data ?? []).length === 0 ? (
        <EmptyState
          title={t("ui.admin.billing.emptyTitle")}
          description={t("ui.admin.billing.emptyBody")}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ui.field.invoice")}</TableHead>
              <TableHead>{t("ui.field.account")}</TableHead>
              <TableHead>{t("ui.field.period")}</TableHead>
              <TableHead>{t("ui.field.status")}</TableHead>
              <TableHead className="text-right">
                {t("ui.field.total")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data ?? []).map((row) => (
              <TableRow key={row.invoice.id}>
                <TableCell className="font-medium tabular-nums">
                  {row.invoice.invoiceNumber
                    ? `#${row.invoice.invoiceNumber} · ${row.invoice.series}`
                    : "Draft"}
                </TableCell>
                <TableCell className="text-sm">
                  {row.accountEmail ?? row.invoice.userId.slice(0, 8)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(row.invoice.periodStart)} —{" "}
                  {formatDate(row.invoice.periodEnd)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.invoice.status === "paid"
                        ? "default"
                        : row.invoice.status === "open"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {row.invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {money(row.invoice.totalCents)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={confirming !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirming(null);
        }}
        title={confirming === "run" ? "Run billing now" : "Consolidate drafts"}
        description={
          confirming === "run"
            ? "Charges every subscription whose period has ended. Idempotent — a second run today finds nothing due, so it is safe to re-run after fixing a payment method."
            : "Closes each open draft and assigns it a number from the platform's own sequence."
        }
        confirmLabel={confirming === "run" ? "Run billing" : "Consolidate"}
        onConfirm={async () => {
          if (confirming === "run") {
            await run.mutateAsync();
          } else {
            await close.mutateAsync();
          }
        }}
      />
    </div>
  );
}
