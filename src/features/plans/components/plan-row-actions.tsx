"use client";

import { RiMoreLine } from "@remixicon/react";
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
import { useArchivePlan } from "../mutations";
import type { Plan } from "../types";
import { PlanFormSheet } from "./plan-form-sheet";

export function PlanRowActions({ plan }: { plan: Plan }) {
  const { t } = useTranslation();

  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archivePlan = useArchivePlan();

  async function handleArchive() {
    await archivePlan.mutateAsync({ planId: plan.id });
    toast.success(`${plan.name} archived`);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ui.admin.plans.rowActions")}
            >
              <RiMoreLine className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            {t("ui.admin.plans.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={!plan.isActive}
            onClick={() => setArchiveOpen(true)}
          >
            {t("ui.action.archive")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PlanFormSheet open={editOpen} onOpenChange={setEditOpen} plan={plan} />
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t("ui.admin.plans.archiveTitle")}
        description={`${plan.name} stops being purchasable. Businesses already on it keep their subscription.`}
        confirmLabel={t("ui.action.archive")}
        variant="destructive"
        onConfirm={handleArchive}
      />
    </>
  );
}
