import { queryOptions } from "@tanstack/react-query";
import { getPlatformOverview } from "./services";

export const overviewQueryKeys = {
  all: ["platform-overview"] as const,
};

export function overviewQueryOptions() {
  return queryOptions({
    queryKey: overviewQueryKeys.all,
    queryFn: getPlatformOverview,
  });
}
