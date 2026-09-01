import type { Translate } from "@/features/i18n/types";

export type Sector = "mart" | "medical" | "restaurant";
export type BusinessStatus = "active" | "suspended" | "closed";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export const SECTORS: Sector[] = ["mart", "medical", "restaurant"];

export function sectorOptions(
  t: Translate,
): { value: Sector; label: string }[] {
  return SECTORS.map((value) => ({
    value,
    label: t(`common.sector.${value}`),
  }));
}

export const BUSINESS_STATUSES: BusinessStatus[] = [
  "active",
  "suspended",
  "closed",
];

export function businessStatusOptions(
  t: Translate,
): { value: BusinessStatus; label: string }[] {
  return BUSINESS_STATUSES.map((value) => ({
    value,
    label: t(`common.status.${value}`),
  }));
}

export interface Business {
  id: string;
  organizationId: string;
  sector: Sector;
  legalName: string;
  panNumber: string | null;
  vatRegistered: boolean;
  cbmsRequired: boolean;
  fiscalYearStartMonth: number;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  businessId: string;
  planId: string;
  planKey: string | null;
  planName: string | null;
  priceCents: number | null;
  currency: string | null;
  billingCycle: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
}

export interface AuditLogEntry {
  id: string;
  invoiceId: string;
  action: string;
  actorUserId: string | null;
  actorName: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  invoiceNumber: number;
  fiscalYear: string;
}
