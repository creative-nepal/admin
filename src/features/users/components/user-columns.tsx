import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/composed/data-table";
import { DataTableColumnHeader } from "@/components/composed/data-table-column-header";
import { UserAvatar } from "@/components/composed/user-avatar";
import { Badge } from "@/components/ui/badge";
import type { Translate } from "@/features/i18n/types";
import { formatDate } from "@/lib/formatters";
import type { AdminUser } from "../types";
import { UserRoleBadge } from "./user-role-badge";
import { UserRowActions } from "./user-row-actions";

export function userColumns(
  t: Translate,
): ColumnDef<DataTableFeatures, AdminUser, unknown>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => row,
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("ui.admin.users.roleUser")}
        />
      ),
      cell: ({ getValue }) => {
        const user = getValue<AdminUser>();
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} image={user.image} />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("ui.field.email")} />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "role",
      header: t("ui.field.role"),
      accessorKey: "role",
      cell: ({ getValue }) => (
        <UserRoleBadge role={getValue<AdminUser["role"]>()} />
      ),
    },
    {
      id: "status",
      header: t("ui.field.status"),
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const user = getValue<AdminUser>();

        if (!user.banned) {
          return <Badge variant="outline">{t("common.status.active")}</Badge>;
        }

        return (
          <div className="flex flex-col gap-1">
            <Badge variant="destructive">
              {user.banExpires ? "Suspended" : "Banned"}
            </Badge>
            {user.banReason && (
              <span className="text-xs text-muted-foreground">
                {user.banReason}
              </span>
            )}
            {user.banExpires && (
              <span className="text-xs text-muted-foreground">
                Until {formatDate(user.banExpires)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("ui.field.joined")} />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(getValue<Date>())}
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
          <UserRowActions user={getValue<AdminUser>()} />
        </div>
      ),
    },
  ];
}
