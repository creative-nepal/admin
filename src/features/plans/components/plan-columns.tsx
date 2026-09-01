import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/composed/data-table";
import { Badge } from "@/components/ui/badge";
import { SectorBadge } from "@/features/businesses/components/business-badges";
import type { Translate } from "@/features/i18n/types";
import { formatCurrency } from "@/lib/formatters";
import type { Plan } from "../types";
import { PlanRowActions } from "./plan-row-actions";

export function planColumns(
  t: Translate,
): ColumnDef<DataTableFeatures, Plan, unknown>[] {
  return [
    {
      id: "plan",
      header: t("ui.field.plan"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const plan = getValue<Plan>();
        return (
          <div className="flex flex-col">
            <span className="font-medium">{plan.name}</span>
            <span className="font-mono text-muted-foreground text-xs">
              {plan.key}
            </span>
          </div>
        );
      },
    },
    {
      id: "sector",
      header: t("ui.field.sector"),
      accessorKey: "sector",
      cell: ({ getValue }) => (
        <SectorBadge sector={getValue<Plan["sector"]>()} />
      ),
    },
    {
      id: "price",
      header: t("ui.field.price"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const plan = getValue<Plan>();
        return (
          <span className="tabular-nums">
            {formatCurrency(plan.priceCents / 100, plan.currency)}
            <span className="text-muted-foreground">
              {" "}
              / {plan.billingCycle}
            </span>
          </span>
        );
      },
    },
    {
      id: "limits",
      header: t("ui.field.limits"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const { featureFlags } = getValue<Plan>();
        return (
          <span className="text-muted-foreground text-sm">
            {featureFlags.maxStaff ?? "∞"} staff ·{" "}
            {featureFlags.maxProducts ?? "∞"} products
          </span>
        );
      },
    },
    {
      id: "status",
      header: t("ui.field.status"),
      accessorKey: "isActive",
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Badge variant="outline">{t("common.status.active")}</Badge>
        ) : (
          <Badge variant="secondary">
            {t("ui.admin.content.pageStatus.archived")}
          </Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      accessorFn: (row) => row,
      enableHiding: false,
      cell: ({ getValue }) => (
        <div className="flex justify-end">
          <PlanRowActions plan={getValue<Plan>()} />
        </div>
      ),
    },
  ];
}
