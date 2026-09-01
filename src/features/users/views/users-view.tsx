"use client";

import { RiAddLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnVisibilityState,
  SortingState,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/composed/data-table";
import { DataTableViewOptions } from "@/components/composed/data-table-view-options";
import { EmptyState } from "@/components/composed/empty-state";
import { PageHeader } from "@/components/composed/page-header";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { userColumns } from "../components/user-columns";
import { UserFormSheet } from "../components/user-form-sheet";
import { UsersFilters } from "../components/users-filters";
import { usePlatformPermissions } from "../hooks/use-platform-permissions";
import { permissionQueryOptions, usersQueryOptions } from "../queries";
import { usersSearchParams } from "../search-params";

export function UsersView() {
  const { t } = useTranslation();
  const usersColumns = useMemo(() => userColumns(t), [t]);

  const [params, setParams] = useQueryStates(usersSearchParams);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({ email: false });
  const [createOpen, setCreateOpen] = useState(false);
  const { can } = usePlatformPermissions();
  const { data: canList, isLoading: isCheckingAccess } = useQuery(
    permissionQueryOptions({ user: ["list"] }),
  );

  const { data, isFetching } = useQuery({
    ...usersQueryOptions({
      search: params.search,
      searchField: params.searchField,
      filter: params.filter,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    }),
    enabled: canList === true,
  });

  const sorting: SortingState = [
    { id: params.sortBy, desc: params.sortDirection === "desc" },
  ];

  if (!isCheckingAccess && canList === false) {
    return (
      <EmptyState
        title={t("ui.admin.users.noAccessTitle")}
        description={t("ui.admin.users.noAccessBody")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.users.title")}
        description={t("ui.admin.users.description")}
        actions={
          can({ user: ["create"] }) ? (
            <Button onClick={() => setCreateOpen(true)}>
              <RiAddLine className="size-4" />
              {t("ui.admin.users.new")}
            </Button>
          ) : null
        }
      />
      <DataTable
        columns={usersColumns}
        data={data?.users ?? []}
        rowCount={data?.total ?? 0}
        isLoading={isFetching && !data}
        sorting={sorting}
        onSortingChange={(updater) => {
          const next =
            typeof updater === "function" ? updater(sorting) : updater;
          const [first] = next;
          if (!first) return;
          void setParams({
            sortBy: first.id as typeof params.sortBy,
            sortDirection: first.desc ? "desc" : "asc",
          });
        }}
        columnFilters={[]}
        onColumnFiltersChange={() => {}}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={(updater) =>
          setColumnVisibility((prev) =>
            typeof updater === "function" ? updater(prev) : updater,
          )
        }
        pagination={{ pageIndex: params.pageIndex, pageSize: params.pageSize }}
        onPaginationChange={(updater) => {
          const current = {
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
          };
          const next =
            typeof updater === "function" ? updater(current) : updater;
          void setParams({
            pageIndex: next.pageIndex,
            pageSize: next.pageSize,
          });
        }}
        emptyMessage={t("ui.admin.users.empty")}
        toolbar={(table) => (
          <>
            <UsersFilters
              search={params.search}
              searchField={params.searchField}
              filter={params.filter}
              onSearchChange={(search) => setParams({ search, pageIndex: 0 })}
              onSearchFieldChange={(searchField) =>
                setParams({ searchField, pageIndex: 0 })
              }
              onFilterChange={(filter) => setParams({ filter, pageIndex: 0 })}
            />
            <DataTableViewOptions table={table} />
          </>
        )}
      />
      <UserFormSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
