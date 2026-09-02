import { api } from "@/lib/api";
import type { PaginatedResult } from "@/types/api";
import type {
  JobRun,
  JobSummary,
  PlatformNotification,
  QueuedEmail,
} from "./types";

export async function listJobs(): Promise<JobSummary[]> {
  const { data } = await api.get<JobSummary[]>("/api/v1/platform/jobs");
  return data;
}

export async function listJobRuns(
  name?: string,
): Promise<PaginatedResult<JobRun>> {
  const { data } = await api.get<PaginatedResult<JobRun>>(
    "/api/v1/platform/jobs/runs",
    { params: { limit: 25, ...(name ? { name } : {}) } },
  );
  return data;
}

export async function runJob(name: string): Promise<JobRun> {
  const { data } = await api.post<JobRun>(
    `/api/v1/platform/jobs/${name}/run`,
    {},
  );
  return data;
}

export async function listEmails(
  status?: string,
): Promise<PaginatedResult<QueuedEmail>> {
  const { data } = await api.get<PaginatedResult<QueuedEmail>>(
    "/api/v1/platform/emails",
    { params: { limit: 25, ...(status ? { status } : {}) } },
  );
  return data;
}

export async function retryEmail(id: string): Promise<QueuedEmail> {
  const { data } = await api.post<QueuedEmail>(
    `/api/v1/platform/emails/${id}/retry`,
    {},
  );
  return data;
}

export async function listPlatformNotifications(): Promise<
  PaginatedResult<PlatformNotification>
> {
  const { data } = await api.get<PaginatedResult<PlatformNotification>>(
    "/api/v1/platform/notifications",
    { params: { limit: 20 } },
  );
  return data;
}
