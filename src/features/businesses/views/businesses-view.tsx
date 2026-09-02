"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ColumnVisibilityState,
  SortingState,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/composed/data-table";
import { DataTableViewOptions } from "@/components/composed/data-table-view-options";
import { PageHeader } from "@/components/composed/page-header";
import { SearchInput } from "@/components/composed/search-input";
import { SelectFilter } from "@/components/composed/select-filter";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSectorOptions } from "@/features/sectors/hooks/use-sectors";
import { businessColumns } from "../components/business-columns";
import { businessesQueryOptions } from "../queries";
import { businessesSearchParams } from "../search-params";
import {
  type BusinessStatus,
  businessStatusOptions,
  type Sector,
} from "../types";

export function BusinessesView() {
  const { t } = useTranslation();
  const sectorOptions = useSectorOptions();
  const businessesColumns = useMemo(() => businessColumns(t), [t]);

  const [params, setParams] = useQueryStates(businessesSearchParams);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});

  const sorting: SortingState = [
    { id: params.sortBy, desc: params.sortDirection === "desc" },
  ];

  const { data, isFetching } = useQuery(
    businessesQueryOptions({
      search: params.search,
      sector: params.sector,
      status: params.status,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.businesses.title")}
        description={t("ui.admin.businesses.description")}
      />
      <DataTable
        columns={businessesColumns}
        data={data?.data ?? []}
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
            pageIndex: 0,
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
        emptyMessage={t("ui.admin.businesses.empty")}
        toolbar={(table) => (
          <>
            <SearchInput
              value={params.search}
              onValueChange={(value) =>
                setParams({ search: value, pageIndex: 0 })
              }
              placeholder={t("ui.admin.businesses.searchPlaceholder")}
              className="max-w-sm"
            />
            <SelectFilter
              className="w-40"
              value={params.sector}
              onValueChange={(value) =>
                setParams({ sector: value as Sector | null, pageIndex: 0 })
              }
              options={sectorOptions}
              allLabel={t("ui.admin.businesses.allSectors")}
            />
            <SelectFilter
              className="w-40"
              value={params.status}
              onValueChange={(value) =>
                setParams({
                  status: value as BusinessStatus | null,
                  pageIndex: 0,
                })
              }
              options={businessStatusOptions(t)}
              allLabel={t("ui.admin.businesses.allStatuses")}
            />
            <DataTableViewOptions table={table} />
          </>
        )}
      />
    </div>
  );
}
