import { queryOptions } from "@tanstack/react-query";
import {
  listEmails,
  listJobRuns,
  listJobs,
  listPlatformNotifications,
} from "./services";

export const operationsQueryKeys = {
  all: ["operations"] as const,
  jobs: () => [...operationsQueryKeys.all, "jobs"] as const,
  runs: (name?: string) =>
    [...operationsQueryKeys.all, "runs", name ?? "all"] as const,
  emails: (status?: string) =>
    [...operationsQueryKeys.all, "emails", status ?? "all"] as const,
  alerts: () => [...operationsQueryKeys.all, "alerts"] as const,
};

export function jobsQueryOptions() {
  return queryOptions({
    queryKey: operationsQueryKeys.jobs(),
    queryFn: listJobs,
    refetchInterval: 30_000,
  });
}

export function jobRunsQueryOptions(name?: string) {
  return queryOptions({
    queryKey: operationsQueryKeys.runs(name),
    queryFn: () => listJobRuns(name),
  });
}

export function emailsQueryOptions(status?: string) {
  return queryOptions({
    queryKey: operationsQueryKeys.emails(status),
    queryFn: () => listEmails(status),
  });
}

export function platformAlertsQueryOptions() {
  return queryOptions({
    queryKey: operationsQueryKeys.alerts(),
    queryFn: listPlatformNotifications,
    refetchInterval: 60_000,
  });
}
