"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/composed/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import { BusinessAuditLog } from "../components/business-audit-log";
import {
  BusinessStatusBadge,
  SectorBadge,
} from "../components/business-badges";
import { BusinessBranchesCard } from "../components/business-branches-card";
import { BusinessSubscriptionCard } from "../components/business-subscription-card";
import { useSetBusinessCompliance } from "../mutations";
import { businessQueryOptions } from "../queries";

export function BusinessDetailView({ businessId }: { businessId: string }) {
  const { t } = useTranslation();

  const { data: business, isPending } = useQuery(
    businessQueryOptions(businessId),
  );
  const setCompliance = useSetBusinessCompliance();

  if (isPending || !business) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("ui.field.business")}
          description={t("ui.action.loading")}
        />
      </div>
    );
  }

  function handleComplianceChange(
    patch: { cbmsRequired?: boolean } | { vatRegistered?: boolean },
  ) {
    toast.promise(setCompliance.mutateAsync({ businessId, ...patch }), {
      loading: "Updating compliance...",
      success: "Compliance settings updated",
      error: (error) =>
        error instanceof Error ? error.message : "Failed to update",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={business.legalName}
        description={`Created ${formatDate(business.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <SectorBadge sector={business.sector} />
            <BusinessStatusBadge status={business.status} />
          </div>
        }
      />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">
            {t("ui.admin.businesses.detailsTab")}
          </TabsTrigger>
          <TabsTrigger value="branches">
            {t("ui.admin.businesses.branchesTab")}
          </TabsTrigger>
          <TabsTrigger value="audit">
            {t("ui.admin.businesses.auditTab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex flex-col gap-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("ui.admin.businesses.detailsTitle")}</CardTitle>
              <CardDescription>
                Sector-agnostic fields from the `businesses` satellite table.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground text-sm">PAN</dt>
                  <dd className="font-medium tabular-nums">
                    {business.panNumber ?? "—"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground text-sm">
                    {t("ui.admin.businesses.fiscalYearStarts")}
                  </dt>
                  <dd className="font-medium">
                    BS month {business.fiscalYearStartMonth}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground text-sm">
                    {t("ui.admin.businesses.organization")}
                  </dt>
                  <dd className="font-mono text-xs">
                    {business.organizationId}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground text-sm">
                    {t("ui.field.status")}
                  </dt>
                  <dd>
                    <BusinessStatusBadge status={business.status} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("ui.admin.businesses.compliance")}</CardTitle>
              <CardDescription>
                Real-time CBMS push is turnover- and sector-gated, so it is set
                per business rather than derived automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="vatRegistered">
                    {t("ui.admin.businesses.vatRegistered")}
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    Adds 13% VAT as a separate line on every invoice.
                  </span>
                </div>
                <Switch
                  id="vatRegistered"
                  checked={business.vatRegistered}
                  onCheckedChange={(checked) =>
                    handleComplianceChange({ vatRegistered: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="cbmsRequired">
                    {t("ui.admin.businesses.cbmsRequired")}
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    Queues every invoice for IRD push. The outbound worker is
                    still a stub.
                  </span>
                </div>
                <Switch
                  id="cbmsRequired"
                  checked={business.cbmsRequired}
                  onCheckedChange={(checked) =>
                    handleComplianceChange({ cbmsRequired: checked })
                  }
                />
              </div>
              {business.cbmsRequired && (
                <Badge variant="outline" className="w-fit">
                  {t("ui.admin.businesses.cbmsQueued")}
                </Badge>
              )}
            </CardContent>
          </Card>

          <BusinessSubscriptionCard business={business} />
        </TabsContent>

        <TabsContent value="branches" className="pt-4">
          <BusinessBranchesCard businessId={business.id} />
        </TabsContent>

        <TabsContent value="audit" className="pt-4">
          <BusinessAuditLog businessId={businessId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
