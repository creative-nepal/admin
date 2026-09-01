"use client";

import { RiMoreLine } from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composed/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSetBusinessStatus } from "../mutations";
import type { Business, BusinessStatus } from "../types";

export function BusinessRowActions({ business }: { business: Business }) {
  const { t } = useTranslation();

  const [pendingStatus, setPendingStatus] = useState<BusinessStatus | null>(
    null,
  );
  const setStatus = useSetBusinessStatus();

  async function handleConfirm() {
    if (!pendingStatus) return;

    await setStatus.mutateAsync({
      businessId: business.id,
      status: pendingStatus,
    });

    toast.success(
      pendingStatus === "active"
        ? `${business.legalName} has been reactivated`
        : `${business.legalName} is now ${pendingStatus}`,
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ui.admin.businesses.rowActions")}
            >
              <RiMoreLine className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<Link href={`/businesses/${business.id}`} />}
          >
            {t("ui.action.viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {business.status === "active" ? (
            <DropdownMenuItem onClick={() => setPendingStatus("suspended")}>
              {t("ui.admin.businesses.suspend")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setPendingStatus("active")}>
              {t("ui.admin.businesses.reactivate")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            disabled={business.status === "closed"}
            onClick={() => setPendingStatus("closed")}
          >
            {t("ui.admin.businesses.close")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null);
        }}
        title={
          pendingStatus === "closed"
            ? "Close business"
            : pendingStatus === "suspended"
              ? "Suspend business"
              : "Reactivate business"
        }
        description={
          pendingStatus === "active"
            ? `${business.legalName} will be able to record sales again.`
            : `${business.legalName} will be blocked from recording sales. Existing invoices stay readable and are never deleted.`
        }
        confirmLabel={
          pendingStatus === "closed"
            ? "Close business"
            : pendingStatus === "suspended"
              ? "Suspend"
              : "Reactivate"
        }
        variant={pendingStatus === "active" ? "default" : "destructive"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
