"use client";

import { toast } from "sonner";
import { EmailField } from "@/components/form/email-field";
import { Form } from "@/components/form/form";
import { PasswordField } from "@/components/form/password-field";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { PLATFORM_ROLES } from "../constants";
import { useCreateUser, useUpdateUser } from "../mutations";
import {
  type CreateUserValues,
  createUserSchema,
  type UpdateUserValues,
  updateUserSchema,
} from "../schemas";
import type { AdminUser } from "../types";

interface UserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser;
}

const roleOptions = PLATFORM_ROLES.map((role) => ({
  value: role,
  label: role === "admin" ? "Admin" : "Regular user",
}));

export function UserFormSheet({
  open,
  onOpenChange,
  user,
}: UserFormSheetProps) {
  const { t } = useTranslation();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  async function handleCreate(values: CreateUserValues) {
    try {
      await createUser.mutateAsync(values);
      toast.success(`${values.name} created`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  }

  async function handleUpdate(values: UpdateUserValues) {
    if (!user) {
      return;
    }

    try {
      await updateUser.mutateAsync({ userId: user.id, ...values });
      toast.success(`${values.name} updated`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user",
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{user ? "Edit user" : "New user"}</SheetTitle>
          <SheetDescription>
            {user
              ? "Changing an email address does not re-verify it."
              : "The account is created verified, with a credential password you set here."}
          </SheetDescription>
        </SheetHeader>
        {user ? (
          <Form
            key={user.id}
            schema={updateUserSchema}
            defaultValues={{ name: user.name, email: user.email }}
            onSubmit={handleUpdate}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2"
          >
            <TextField name="name" label={t("ui.field.name")} />
            <EmailField name="email" label={t("ui.field.email")} />
            <SheetFooter className="px-0">
              <Button type="submit">{t("ui.action.saveChanges")}</Button>
            </SheetFooter>
          </Form>
        ) : (
          <Form
            key="new"
            schema={createUserSchema}
            defaultValues={{
              name: "",
              email: "",
              password: "",
              role: "user" as const,
            }}
            onSubmit={handleCreate}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2"
          >
            <TextField name="name" label={t("ui.field.name")} />
            <EmailField name="email" label={t("ui.field.email")} />
            <PasswordField name="password" label={t("ui.field.password")} />
            <SelectField
              name="role"
              label={t("ui.field.role")}
              options={roleOptions}
            />
            <SheetFooter className="px-0">
              <Button type="submit">{t("ui.admin.users.createUser")}</Button>
            </SheetFooter>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
