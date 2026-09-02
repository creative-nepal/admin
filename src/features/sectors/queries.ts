import { queryOptions } from "@tanstack/react-query";
import { listSectors } from "./services";

export const sectorQueryKeys = {
  all: ["sectors"] as const,
};

export function sectorsQueryOptions() {
  return queryOptions({
    queryKey: sectorQueryKeys.all,
    queryFn: listSectors,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
