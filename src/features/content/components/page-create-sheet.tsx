"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "@/components/form/form";
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
import { useCreateContentPage } from "../mutations";
import { type PageCreateValues, pageCreateSchema } from "../schemas";
import { LOCALE_OPTIONS } from "../types";

export function PageCreateSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();

  const router = useRouter();
  const createPage = useCreateContentPage();

  async function handleSubmit(values: PageCreateValues) {
    try {
      const page = await createPage.mutateAsync({
        slug: values.slug,
        title: values.title,
        navLabel: values.navLabel || undefined,
        locale: values.locale,
      });
      toast.success(t("ui.admin.content.createdToast", { slug: page.slug }));
      onOpenChange(false);
      router.push(`/content/${page.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("ui.admin.content.createFailed"),
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("ui.admin.content.newPage")}</SheetTitle>
          <SheetDescription>
            {t("ui.admin.content.newPageHint")}
          </SheetDescription>
        </SheetHeader>
        <Form
          schema={pageCreateSchema}
          defaultValues={{ slug: "", title: "", navLabel: "", locale: "en" }}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2"
        >
          <TextField
            name="slug"
            label={t("ui.admin.content.slug")}
            description={t("ui.admin.content.slugHint")}
            placeholder="pricing"
          />
          <TextField
            name="title"
            label={t("ui.field.title")}
            placeholder="Pricing"
          />
          <TextField
            name="navLabel"
            label={t("ui.admin.content.navLabel")}
            description={t("ui.admin.content.navLabelHint")}
          />
          <SelectField
            name="locale"
            label={t("ui.admin.content.firstTranslation")}
            options={LOCALE_OPTIONS}
          />
          <SheetFooter className="px-0">
            <Button type="submit" disabled={createPage.isPending}>
              {t("ui.admin.content.createPage")}
            </Button>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
