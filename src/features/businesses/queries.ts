import { queryOptions } from "@tanstack/react-query";
import {
  getBusiness,
  type ListBusinessesParams,
  listAuditLog,
  listBusinesses,
  listSubscriptions,
} from "./services";

export const businessesQueryKeys = {
  all: ["businesses"] as const,
  list: (params: ListBusinessesParams) =>
    [...businessesQueryKeys.all, "list", params] as const,
  detail: (businessId: string) =>
    [...businessesQueryKeys.all, "detail", businessId] as const,
  subscriptions: (businessId: string) =>
    [...businessesQueryKeys.all, "subscriptions", businessId] as const,
  auditLog: (businessId: string, pageIndex: number, pageSize: number) =>
    [
      ...businessesQueryKeys.all,
      "audit-log",
      businessId,
      pageIndex,
      pageSize,
    ] as const,
};

export function businessesQueryOptions(params: ListBusinessesParams) {
  return queryOptions({
    queryKey: businessesQueryKeys.list(params),
    queryFn: () => listBusinesses(params),
    placeholderData: (previous) => previous,
  });
}

export function businessQueryOptions(businessId: string) {
  return queryOptions({
    queryKey: businessesQueryKeys.detail(businessId),
    queryFn: () => getBusiness(businessId),
  });
}

export function businessSubscriptionsQueryOptions(businessId: string) {
  return queryOptions({
    queryKey: businessesQueryKeys.subscriptions(businessId),
    queryFn: () => listSubscriptions(businessId),
  });
}

export function businessAuditLogQueryOptions(
  businessId: string,
  pageIndex: number,
  pageSize: number,
) {
  return queryOptions({
    queryKey: businessesQueryKeys.auditLog(businessId, pageIndex, pageSize),
    queryFn: () => listAuditLog(businessId, pageIndex, pageSize),
    placeholderData: (previous) => previous,
  });
}
