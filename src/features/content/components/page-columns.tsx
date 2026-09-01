import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/composed/data-table";
import { Badge } from "@/components/ui/badge";
import type { Translate } from "@/features/i18n/types";
import { formatDateTime } from "@/lib/formatters";
import type { ContentPage } from "../types";
import { PageRowActions } from "./page-row-actions";
import { PageStatusBadge } from "./page-status-badge";

export function pageColumns(
  t: Translate,
): ColumnDef<DataTableFeatures, ContentPage, unknown>[] {
  return [
    {
      id: "slug",
      header: t("ui.field.page"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const page = getValue<ContentPage>();
        const title = page.translations.find(
          (translation) => translation.locale === "en",
        )?.title;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{title ?? page.slug}</span>
            <span className="font-mono text-muted-foreground text-xs">
              /{page.slug === "home" ? "" : page.slug}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("ui.field.status"),
      accessorKey: "status",
      cell: ({ getValue }) => (
        <PageStatusBadge status={getValue<ContentPage["status"]>()} />
      ),
    },
    {
      id: "locales",
      header: t("ui.admin.content.translations"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const page = getValue<ContentPage>();

        return (
          <div className="flex gap-1">
            {page.translations.map((translation) => (
              <Badge key={translation.locale} variant="outline">
                {translation.locale} · {translation.blocks.length}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "updatedAt",
      header: t("ui.field.updated"),
      accessorKey: "updatedAt",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-xs">
          {formatDateTime(getValue<string>())}
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
          <PageRowActions page={getValue<ContentPage>()} />
        </div>
      ),
    },
  ];
}
