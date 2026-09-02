import { api } from "@/lib/api";
import type { PaginatedResult } from "@/types/api";
import type {
  AuditLogEntry,
  Branch,
  Business,
  BusinessStatus,
  Sector,
  Subscription,
} from "./types";

export interface ListBusinessesParams {
  search: string;
  sector: Sector | null;
  status: BusinessStatus | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageIndex: number;
  pageSize: number;
}

export async function listBusinesses({
  search,
  sector,
  status,
  sortBy,
  sortDirection,
  pageIndex,
  pageSize,
}: ListBusinessesParams): Promise<PaginatedResult<Business>> {
  const { data } = await api.get<PaginatedResult<Business>>(
    "/api/v1/businesses",
    {
      params: {
        search: search || undefined,
        sector: sector ?? undefined,
        status: status ?? undefined,
        sortBy,
        sortDirection,
        limit: pageSize,
        offset: pageIndex * pageSize,
      },
    },
  );

  return data;
}

export async function getBusiness(businessId: string): Promise<Business> {
  const { data } = await api.get<Business>(`/api/v1/businesses/${businessId}`);
  return data;
}

export async function setBusinessStatus(
  businessId: string,
  status: BusinessStatus,
): Promise<Business> {
  const { data } = await api.patch<Business>(
    `/api/v1/businesses/${businessId}/status`,
    { status },
  );
  return data;
}

export async function setBusinessCompliance(
  businessId: string,
  patch: { cbmsRequired?: boolean; vatRegistered?: boolean },
): Promise<Business> {
  const { data } = await api.patch<Business>(
    `/api/v1/businesses/${businessId}/compliance`,
    patch,
  );
  return data;
}

export async function listSubscriptions(
  businessId: string,
): Promise<Subscription[]> {
  const { data } = await api.get<Subscription[]>(
    `/api/v1/businesses/${businessId}/subscriptions`,
    { params: { limit: 50, offset: 0 } },
  );
  return data;
}

export async function assignSubscription(
  businessId: string,
  planId: string,
): Promise<Subscription> {
  const { data } = await api.post<Subscription>(
    `/api/v1/businesses/${businessId}/subscriptions`,
    { planId },
  );
  return data;
}

export async function cancelSubscription(
  businessId: string,
  immediate: boolean,
): Promise<Subscription> {
  const { data } = await api.patch<Subscription>(
    `/api/v1/businesses/${businessId}/subscriptions/cancel`,
    { immediate },
  );
  return data;
}

export async function listAuditLog(
  businessId: string,
  pageIndex: number,
  pageSize: number,
): Promise<PaginatedResult<AuditLogEntry>> {
  const { data } = await api.get<PaginatedResult<AuditLogEntry>>(
    `/api/v1/platform/businesses/${businessId}/audit-log`,
    { params: { limit: pageSize, offset: pageIndex * pageSize } },
  );
  return data;
}

export async function listBusinessBranches(
  businessId: string,
): Promise<PaginatedResult<Branch>> {
  const { data } = await api.get<PaginatedResult<Branch>>(
    `/api/v1/businesses/${businessId}/branches`,
    { params: { limit: 100 } },
  );
  return data;
}
