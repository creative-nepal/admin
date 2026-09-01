import { queryOptions } from "@tanstack/react-query";
import { listPlatformInvoices } from "./services";

export const billingQueryKeys = {
  all: ["platform-billing"] as const,
};

export function platformInvoicesQueryOptions() {
  return queryOptions({
    queryKey: billingQueryKeys.all,
    queryFn: listPlatformInvoices,
  });
}
