"use client";

import { toast } from "sonner";
import { ContentDialog } from "@/components/composed/content-dialog";
import { Form } from "@/components/form/form";
import { SelectField } from "@/components/form/select-field";
import { TextareaField } from "@/components/form/textarea-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { banDurations } from "../constants";
import { useBanUser } from "../mutations";
import { type BanUserValues, banUserSchema } from "../schemas";
import type { AdminUser } from "../types";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
}: BanUserDialogProps) {
  const { t } = useTranslation();
  const durationOptions = banDurations(t);

  const banUser = useBanUser();

  async function handleSubmit(values: BanUserValues) {
    const duration = durationOptions.find(
      (option) => option.value === values.duration,
    );

    try {
      await banUser.mutateAsync({
        userId: user.id,
        banReason: values.banReason,
        banExpiresIn: duration?.seconds ?? null,
      });
      toast.success(`${user.name} has been banned`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to ban user",
      );
    }
  }

  return (
    <ContentDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("ui.admin.users.ban")}
      description={`${user.name} will be signed out of every session and blocked from signing in. The reason is shown to them at sign-in.`}
    >
      <Form
        schema={banUserSchema}
        defaultValues={{ banReason: "", duration: "permanent" as const }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <TextareaField
          name="banReason"
          label={t("ui.field.reason")}
          placeholder="Repeated chargebacks"
        />
        <SelectField
          name="duration"
          label={t("ui.field.duration")}
          options={durationOptions}
        />
        <Button type="submit" variant="destructive">
          {t("ui.admin.users.ban")}
        </Button>
      </Form>
    </ContentDialog>
  );
}
