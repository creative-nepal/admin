"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { EmptyState } from "@/components/composed/empty-state";
import { PageHeader } from "@/components/composed/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BusinessStatusBadge,
  SectorBadge,
} from "@/features/businesses/components/business-badges";
import { StatTile } from "@/features/businesses/components/stat-tile";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import { overviewQueryOptions } from "../queries";

export function OverviewView() {
  const { t } = useTranslation();

  const { data, isPending } = useQuery(overviewQueryOptions());

  const businesses = data?.businesses;
  const subscriptions = data?.subscriptions;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.overview.title")}
        description={t("ui.admin.overview.description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={t("ui.admin.overview.activeBusinesses")}
          value={isPending ? "—" : (businesses?.byStatus.active ?? 0)}
          hint={`${businesses?.total ?? 0} total`}
        />
        <StatTile
          label={t("ui.admin.overview.activeSubscriptions")}
          value={isPending ? "—" : (subscriptions?.byStatus.active ?? 0)}
          hint={`${subscriptions?.byStatus.trialing ?? 0} trialing`}
        />
        <StatTile
          label={t("ui.admin.overview.pastDue")}
          value={isPending ? "—" : (subscriptions?.byStatus.past_due ?? 0)}
          hint={t("ui.admin.overview.pastDueHint")}
          tone={
            (subscriptions?.byStatus.past_due ?? 0) > 0 ? "danger" : "default"
          }
        />
        <StatTile
          label={t("ui.admin.overview.failedCbms")}
          value={isPending ? "—" : (data?.cbms.failed ?? 0)}
          hint={`${data?.cbms.pending ?? 0} pending`}
          tone={(data?.cbms.failed ?? 0) > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("ui.admin.overview.bySector")}</CardTitle>
            <CardDescription>
              {t("ui.admin.overview.bySectorHint")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3">
              {Object.entries(businesses?.bySector ?? {}).map(
                ([sector, count]) => (
                  <div
                    key={sector}
                    className="flex items-center justify-between"
                  >
                    <dt>
                      <SectorBadge
                        sector={sector as "mart" | "medical" | "restaurant"}
                      />
                    </dt>
                    <dd className="font-medium tabular-nums">{count}</dd>
                  </div>
                ),
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("ui.admin.overview.recent")}</CardTitle>
            <CardDescription>
              {t("ui.admin.overview.recentHint")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.recentBusinesses.length ?? 0) === 0 ? (
              <EmptyState
                title={t("ui.admin.overview.emptyTitle")}
                description={t("ui.admin.overview.emptyBody")}
              />
            ) : (
              <ul className="flex flex-col divide-y">
                {data?.recentBusinesses.map((business) => (
                  <li key={business.id}>
                    <Link
                      href={`/businesses/${business.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:underline"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {business.legalName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(business.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SectorBadge sector={business.sector} />
                        <BusinessStatusBadge status={business.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
