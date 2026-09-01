"use client";

import { toast } from "sonner";
import { ContentDialog } from "@/components/composed/content-dialog";
import { Form } from "@/components/form/form";
import { PasswordField } from "@/components/form/password-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSetUserPassword } from "../mutations";
import { type SetPasswordValues, setPasswordSchema } from "../schemas";
import type { AdminUser } from "../types";

interface SetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}

export function SetPasswordDialog({
  open,
  onOpenChange,
  user,
}: SetPasswordDialogProps) {
  const { t } = useTranslation();

  const setPassword = useSetUserPassword();

  async function handleSubmit(values: SetPasswordValues) {
    try {
      await setPassword.mutateAsync({
        userId: user.id,
        newPassword: values.newPassword,
      });
      toast.success(`Password set for ${user.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to set password",
      );
    }
  }

  return (
    <ContentDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("ui.admin.users.setPassword")}
      description={`${user.name} will be able to sign in with this password immediately. Their existing sessions stay valid — revoke them separately if that is the intent.`}
    >
      <Form
        schema={setPasswordSchema}
        defaultValues={{ newPassword: "", confirmPassword: "" }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <PasswordField name="newPassword" label={t("ui.field.newPassword")} />
        <PasswordField
          name="confirmPassword"
          label={t("ui.field.confirmPassword")}
        />
        <Button type="submit">{t("ui.admin.users.setPassword")}</Button>
      </Form>
    </ContentDialog>
  );
}
