"use client";

import { RiErrorWarningLine } from "@remixicon/react";
import Link from "next/link";
import { useEffect } from "react";
import { ErrorState } from "@/components/composed/error-state";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { logRouteError } from "@/lib/log-error";
import type { RouteErrorProps } from "@/types/error";

export default function DashboardError({ error, retry }: RouteErrorProps) {
  const { t } = useTranslation();

  useEffect(() => {
    logRouteError(error, "dashboard");
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ErrorState
        icon={<RiErrorWarningLine />}
        title={t("ui.error.viewFailedTitle")}
        description={t("ui.error.viewFailedBody")}
        digest={error.digest}
        digestLabel={t("ui.error.reference")}
        action={
          <div className="flex items-center gap-2">
            <Button onClick={() => retry()}>{t("ui.action.tryAgain")}</Button>
            <Button variant="outline" render={<Link href="/" />}>
              {t("ui.action.backToOverview")}
            </Button>
          </div>
        }
      />
    </div>
  );
}
