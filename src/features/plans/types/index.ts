import type { Sector } from "@/features/businesses/types";
import type { Translate } from "@/features/i18n/types";

export type BillingCycle = "monthly" | "yearly";

export const BILLING_CYCLES: BillingCycle[] = ["monthly", "yearly"];

export function billingCycleOptions(
  t: Translate,
): { value: BillingCycle; label: string }[] {
  return BILLING_CYCLES.map((value) => ({
    value,
    label: t(`ui.admin.plans.${value}`),
  }));
}

export interface PlanFeatureFlags {
  maxStaff?: number;
  maxProducts?: number;
  [key: string]: unknown;
}

export interface Plan {
  id: string;
  sector: Sector;
  key: string;
  name: string;
  priceCents: number;
  currency: string;
  billingCycle: BillingCycle;
  featureFlags: PlanFeatureFlags;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanInput {
  sector: Sector;
  key: string;
  name: string;
  priceCents: number;
  currency: string;
  billingCycle: BillingCycle;
  featureFlags: PlanFeatureFlags;
}
