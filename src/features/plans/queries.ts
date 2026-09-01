import { queryOptions } from "@tanstack/react-query";
import { type ListPlansParams, listPlans } from "./services";

export const plansQueryKeys = {
  all: ["plans"] as const,
  list: (params: ListPlansParams) =>
    [...plansQueryKeys.all, "list", params] as const,
};

export function plansQueryOptions(params: ListPlansParams) {
  return queryOptions({
    queryKey: plansQueryKeys.list(params),
    queryFn: () => listPlans(params),
    placeholderData: (previous) => previous,
  });
}
