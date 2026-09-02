"use client";

import { useQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/composed/data-table";
import { PageHeader } from "@/components/composed/page-header";
import { SelectFilter } from "@/components/composed/select-filter";
import { Button } from "@/components/ui/button";
import type { Sector } from "@/features/businesses/types";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSectorOptions } from "@/features/sectors/hooks/use-sectors";
import { planColumns } from "../components/plan-columns";
import { PlanFormSheet } from "../components/plan-form-sheet";
import { plansQueryOptions } from "../queries";
import { plansSearchParams } from "../search-params";

export function PlansView() {
  const { t } = useTranslation();
  const sectorOptions = useSectorOptions();
  const plansColumns = useMemo(() => planColumns(t), [t]);

  const [params, setParams] = useQueryStates(plansSearchParams);
  const [createOpen, setCreateOpen] = useState(false);

  const sorting: SortingState = [
    { id: params.sortBy, desc: params.sortDirection === "desc" },
  ];

  const { data, isFetching } = useQuery(
    plansQueryOptions({
      sector: params.sector,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.plans.title")}
        description={t("ui.admin.plans.description")}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            {t("ui.admin.plans.new")}
          </Button>
        }
      />
      <DataTable
        columns={plansColumns}
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
        emptyMessage={t("ui.admin.plans.empty")}
        toolbar={() => (
          <SelectFilter
            className="w-40"
            value={params.sector}
            onValueChange={(value) =>
              setParams({ sector: value as Sector | null, pageIndex: 0 })
            }
            options={sectorOptions}
            allLabel={t("ui.admin.businesses.allSectors")}
          />
        )}
      />
      <PlanFormSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
