"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composed/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { plansQueryOptions } from "@/features/plans/queries";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useAssignSubscription, useCancelSubscription } from "../mutations";
import { businessSubscriptionsQueryOptions } from "../queries";
import type { Business } from "../types";
import { SubscriptionStatusBadge } from "./business-badges";

export function BusinessSubscriptionCard({ business }: { business: Business }) {
  const { t } = useTranslation();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: subscriptions } = useQuery(
    businessSubscriptionsQueryOptions(business.id),
  );
  const { data: plans } = useQuery(
    plansQueryOptions({
      sector: business.sector,
      sortBy: "priceCents",
      sortDirection: "asc",
      pageIndex: 0,
      pageSize: 50,
    }),
  );

  const assign = useAssignSubscription();
  const cancel = useCancelSubscription();

  const current = subscriptions?.find(
    (subscription) => subscription.status !== "canceled",
  );

  function handleAssign() {
    if (!selectedPlanId) return;

    toast.promise(
      assign.mutateAsync({ businessId: business.id, planId: selectedPlanId }),
      {
        loading: "Assigning plan...",
        success: "Plan assigned",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to assign plan",
      },
    );
  }

  async function handleCancel() {
    await cancel.mutateAsync({ businessId: business.id, immediate: false });
    toast.success(t("ui.admin.businesses.subscriptionEnding"));
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("ui.admin.businesses.subscription")}</CardTitle>
          <CardDescription>
            Assigning a plan activates it directly — no payment gateway is wired
            up yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {current ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground text-sm">
                  {t("ui.field.plan")}
                </dt>
                <dd className="font-medium">{current.planName ?? "—"}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground text-sm">
                  {t("ui.field.status")}
                </dt>
                <dd>
                  <SubscriptionStatusBadge status={current.status} />
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground text-sm">
                  {t("ui.field.price")}
                </dt>
                <dd className="tabular-nums">
                  {current.priceCents === null
                    ? "—"
                    : `${formatCurrency(current.priceCents / 100, current.currency ?? "NPR")} / ${current.billingCycle}`}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground text-sm">
                  {t("ui.admin.businesses.periodEnds")}
                </dt>
                <dd>
                  {formatDate(current.currentPeriodEnd)}
                  {current.cancelAtPeriodEnd && " (cancels)"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground text-sm">
              {t("ui.admin.businesses.noSubscription")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedPlanId}
              onValueChange={(value) => setSelectedPlanId(value ?? "")}
              items={(plans?.data ?? [])
                .filter((plan) => plan.isActive)
                .map((plan) => ({
                  value: plan.id,
                  label: `${plan.name} — ${formatCurrency(plan.priceCents / 100, plan.currency)}`,
                }))}
            >
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={t("ui.admin.businesses.choosePlan")}
                />
              </SelectTrigger>
              <SelectContent>
                {(plans?.data ?? [])
                  .filter((plan) => plan.isActive)
                  .map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} —{" "}
                      {formatCurrency(plan.priceCents / 100, plan.currency)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssign}
              disabled={!selectedPlanId || assign.isPending}
            >
              {current ? "Change plan" : "Assign plan"}
            </Button>
            {current && (
              <Button variant="outline" onClick={() => setCancelOpen(true)}>
                {t("ui.action.cancel")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={t("ui.admin.businesses.cancelSubscription")}
        description={`${business.legalName} keeps access until the end of the current billing period.`}
        confirmLabel={t("ui.admin.businesses.cancelSubscription")}
        variant="destructive"
        onConfirm={handleCancel}
      />
    </>
  );
}
