export interface JobRun {
  id: string;
  name: string;
  status: "running" | "succeeded" | "failed";
  trigger: "schedule" | "manual";
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  detail: Record<string, unknown>;
  error: string | null;
}

export interface JobSummary {
  name: string;
  schedule: string;
  lastRun: JobRun | null;
}

export interface QueuedEmail {
  id: string;
  recipient: string;
  subject: string;
  template: string;
  status: "pending" | "sent" | "failed";
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface PlatformNotification {
  id: string;
  severity: "info" | "warning" | "critical";
  titleKey: string;
  bodyKey: string | null;
  params: Record<string, string | number>;
  createdAt: string;
  read: boolean;
}
