import { RiCompass3Line } from "@remixicon/react";
import Link from "next/link";
import { ErrorState } from "@/components/composed/error-state";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/features/i18n/server";

export default async function DashboardNotFound() {
  const { t } = await getTranslations();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ErrorState
        code="404"
        icon={<RiCompass3Line />}
        title={t("ui.error.recordNotFoundTitle")}
        description={t("ui.error.recordNotFoundBody")}
        action={
          <Button render={<Link href="/" />}>
            {t("ui.action.backToOverview")}
          </Button>
        }
      />
    </div>
  );
}
