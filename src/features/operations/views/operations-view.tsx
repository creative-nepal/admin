"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/composed/empty-state";
import { PageHeader } from "@/components/composed/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import {
  emailsQueryOptions,
  jobRunsQueryOptions,
  jobsQueryOptions,
  operationsQueryKeys,
  platformAlertsQueryOptions,
} from "../queries";
import { retryEmail, runJob } from "../services";

function statusVariant(status: string) {
  if (status === "failed") return "destructive" as const;
  if (status === "succeeded" || status === "sent") return "outline" as const;
  return "secondary" as const;
}

function JobsTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: jobs } = useQuery(jobsQueryOptions());
  const { data: runs } = useQuery(jobRunsQueryOptions());

  const trigger = useMutation({
    mutationFn: (name: string) => runJob(name),
    onSuccess: (run) => {
      void queryClient.invalidateQueries({ queryKey: operationsQueryKeys.all });
      toast.success(`${run.name}: ${run.status}`);
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? t("ui.error.generic"),
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("ui.field.name")}</TableHead>
            <TableHead>{t("ui.admin.notifications.schedule")}</TableHead>
            <TableHead>{t("ui.admin.notifications.lastRun")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(jobs ?? []).map((job) => (
            <TableRow key={job.name}>
              <TableCell className="font-medium">{job.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {job.schedule}
              </TableCell>
              <TableCell>
                {job.lastRun ? (
                  <span className="flex items-center gap-2">
                    <Badge variant={statusVariant(job.lastRun.status)}>
                      {job.lastRun.status}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {job.lastRun.startedAt.slice(0, 19).replace("T", " ")}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={trigger.isPending}
                    onClick={() => trigger.mutate(job.name)}
                  >
                    {t("ui.admin.notifications.runNow")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">
          {t("ui.admin.notifications.runsTitle")}
        </span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ui.field.name")}</TableHead>
              <TableHead>{t("ui.field.status")}</TableHead>
              <TableHead className="text-right">
                {t("ui.admin.notifications.duration")}
              </TableHead>
              <TableHead>{t("ui.field.when")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(runs?.data ?? []).map((run) => (
              <TableRow key={run.id}>
                <TableCell className="font-medium">{run.name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(run.status)}>
                    {run.status}
                  </Badge>
                  {run.error && (
                    <span className="block text-destructive text-xs">
                      {run.error}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {run.durationMs === null ? "—" : `${run.durationMs}ms`}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {run.startedAt.slice(0, 19).replace("T", " ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function EmailsTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data } = useQuery(emailsQueryOptions(status));

  const retry = useMutation({
    mutationFn: (id: string) => retryEmail(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: operationsQueryKeys.all });
      toast.success(t("ui.admin.notifications.retry"));
    },
  });

  const rows = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[undefined, "pending", "sent", "failed"].map((value) => (
          <Button
            key={value ?? "all"}
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => setStatus(value)}
          >
            {value ?? t("ui.field.allBranches").replace("branches", "")}
          </Button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState title={t("ui.admin.notifications.emailsTitle")} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ui.field.email")}</TableHead>
              <TableHead>{t("ui.field.title")}</TableHead>
              <TableHead>{t("ui.field.status")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((email) => (
              <TableRow key={email.id}>
                <TableCell className="font-medium">
                  {email.recipient}
                  <span className="block text-muted-foreground text-xs">
                    {email.template}
                  </span>
                </TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(email.status)}>
                    {email.status}
                  </Badge>
                  <span className="block text-muted-foreground text-xs tabular-nums">
                    {email.attempts}/{email.maxAttempts}
                  </span>
                  {email.lastError && (
                    <span className="block text-destructive text-xs">
                      {email.lastError}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {email.status === "failed" && (
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={retry.isPending}
                        onClick={() => retry.mutate(email.id)}
                      >
                        {t("ui.admin.notifications.retry")}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function AlertsTab() {
  const { t } = useTranslation();
  const { data } = useQuery(platformAlertsQueryOptions());
  const rows = data?.data ?? [];

  if (rows.length === 0) {
    return <EmptyState title={t("ui.web.notifications.allRead")} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((alert) => (
        <div
          key={alert.id}
          className="flex flex-col gap-1 rounded-none border p-3"
        >
          <span className="flex items-center gap-2">
            <Badge
              variant={
                alert.severity === "critical" ? "destructive" : "secondary"
              }
            >
              {alert.severity}
            </Badge>
            <span className="font-medium">
              {t(alert.titleKey, alert.params)}
            </span>
          </span>
          {alert.bodyKey && (
            <span className="text-muted-foreground text-sm">
              {t(alert.bodyKey, alert.params)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function OperationsView() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.notifications.jobsTitle")}
        description={t("ui.admin.notifications.runsTitle")}
      />

      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">
            {t("ui.admin.notifications.jobsTitle")}
          </TabsTrigger>
          <TabsTrigger value="emails">
            {t("ui.admin.notifications.emailsTitle")}
          </TabsTrigger>
          <TabsTrigger value="alerts">
            {t("ui.admin.notifications.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="pt-4">
          <JobsTab />
        </TabsContent>
        <TabsContent value="emails" className="pt-4">
          <EmailsTab />
        </TabsContent>
        <TabsContent value="alerts" className="pt-4">
          <AlertsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
