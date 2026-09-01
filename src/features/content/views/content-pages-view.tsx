"use client";

import { RiMenuLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/composed/data-table";
import { PageHeader } from "@/components/composed/page-header";
import { SearchInput } from "@/components/composed/search-input";
import { SelectFilter } from "@/components/composed/select-filter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { pageColumns } from "../components/page-columns";
import { PageCreateSheet } from "../components/page-create-sheet";
import { contentPagesQueryOptions } from "../queries";
import { contentSearchParams } from "../search-params";
import { type ContentPageStatus, pageStatusOptions } from "../types";

export function ContentPagesView() {
  const { t } = useTranslation();
  const contentColumns = useMemo(() => pageColumns(t), [t]);

  const [params, setParams] = useQueryStates(contentSearchParams);
  const [createOpen, setCreateOpen] = useState(false);

  const sorting: SortingState = [
    { id: params.sortBy, desc: params.sortDirection === "desc" },
  ];

  const { data, isFetching } = useQuery(
    contentPagesQueryOptions({
      status: params.status,
      search: params.search,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.content.title")}
        description={t("ui.admin.content.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              render={<Link href="/content/navigation" />}
              nativeButton={false}
            >
              <RiMenuLine /> {t("ui.admin.content.navigation")}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              {t("ui.admin.content.newPage")}
            </Button>
          </div>
        }
      />
      <DataTable
        columns={contentColumns}
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
        emptyMessage={t("ui.admin.content.empty")}
        toolbar={() => (
          <div className="flex items-center gap-2">
            <SearchInput
              className="w-56"
              placeholder={t("ui.admin.content.searchPlaceholder")}
              value={params.search}
              onValueChange={(value) =>
                setParams({ search: value, pageIndex: 0 })
              }
            />
            <SelectFilter
              className="w-40"
              value={params.status}
              onValueChange={(value) =>
                setParams({
                  status: value as ContentPageStatus | null,
                  pageIndex: 0,
                })
              }
              options={pageStatusOptions(t)}
              allLabel={t("ui.admin.businesses.allStatuses")}
            />
          </div>
        )}
      />
      <PageCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
