import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/composed/data-table";
import { Badge } from "@/components/ui/badge";
import type { Translate } from "@/features/i18n/types";
import { formatDate } from "@/lib/formatters";
import type { Business } from "../types";
import { BusinessStatusBadge, SectorBadge } from "./business-badges";
import { BusinessRowActions } from "./business-row-actions";

export function businessColumns(
  t: Translate,
): ColumnDef<DataTableFeatures, Business, unknown>[] {
  return [
    {
      id: "business",
      header: t("ui.field.business"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const business = getValue<Business>();
        return (
          <div className="flex flex-col">
            <span className="font-medium">{business.legalName}</span>
            <span className="text-muted-foreground text-xs">
              {business.panNumber ? `PAN ${business.panNumber}` : "No PAN"}
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
        <SectorBadge sector={getValue<Business["sector"]>()} />
      ),
    },
    {
      id: "status",
      header: t("ui.field.status"),
      accessorKey: "status",
      cell: ({ getValue }) => (
        <BusinessStatusBadge status={getValue<Business["status"]>()} />
      ),
    },
    {
      id: "compliance",
      header: t("ui.field.compliance"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const business = getValue<Business>();
        return (
          <div className="flex flex-wrap gap-1">
            {business.vatRegistered && (
              <Badge variant="outline">{t("common.invoice.vat")}</Badge>
            )}
            {business.cbmsRequired && <Badge variant="outline">CBMS</Badge>}
            {!business.vatRegistered && !business.cbmsRequired && (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </div>
        );
      },
    },
    {
      id: "createdAt",
      header: t("ui.field.created"),
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(getValue<string>())}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessorFn: (row) => row,
      enableHiding: false,
      cell: ({ getValue }) => (
        <div className="flex justify-end">
          <BusinessRowActions business={getValue<Business>()} />
        </div>
      ),
    },
  ];
}
