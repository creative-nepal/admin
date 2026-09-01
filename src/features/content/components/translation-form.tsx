"use client";

import { toast } from "sonner";
import { Form } from "@/components/form/form";
import { SwitchField } from "@/components/form/switch-field";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSaveTranslation } from "../mutations";
import {
  type TranslationFormValues,
  toTranslationFormValues,
  toTranslationPayload,
  translationFormSchema,
} from "../schemas";
import type { ContentLocale, ContentPage } from "../types";
import { BlockEditor } from "./block-editor";

export function TranslationForm({
  page,
  locale,
}: {
  page: ContentPage;
  locale: ContentLocale;
}) {
  const { t } = useTranslation();

  const saveTranslation = useSaveTranslation();
  const translation = page.translations.find((row) => row.locale === locale);
  const defaultValues = toTranslationFormValues(translation, page.slug);

  async function handleSubmit(values: TranslationFormValues) {
    try {
      await saveTranslation.mutateAsync({
        pageId: page.id,
        locale,
        ...toTranslationPayload(values),
      });
      toast.success(
        t("ui.admin.content.contentSaved", { locale: locale.toUpperCase() }),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("ui.admin.content.saveFailed"),
      );
    }
  }

  return (
    <Form
      key={`${locale}-${translation?.updatedAt ?? "new"}`}
      schema={translationFormSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 border p-4">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-sm font-medium">
            {t("ui.admin.content.pageDetails")}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("ui.admin.content.pageDetailsHint")}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField name="title" label={t("ui.field.title")} />
          <TextField
            name="navLabel"
            label={t("ui.admin.content.navLabel")}
            description={t("ui.admin.content.navLabelHint")}
          />
        </div>
        <TextField
          name="seoTitle"
          label={t("ui.admin.content.seoTitle")}
          description={t("ui.admin.content.seoTitleHint")}
        />
        <TextareaField
          name="seoDescription"
          label={t("ui.admin.content.seoDescription")}
          rows={2}
        />
        <TextField
          name="ogImageUrl"
          label={t("ui.admin.content.socialImage")}
        />
        <SwitchField
          name="noIndex"
          label={t("ui.admin.content.noIndex")}
          description={t("ui.admin.content.noIndexHint")}
        />
      </div>

      <BlockEditor />

      <div className="flex justify-end">
        <Button type="submit" disabled={saveTranslation.isPending}>
          {t("ui.admin.content.saveContent", { locale: locale.toUpperCase() })}
        </Button>
      </div>
    </Form>
  );
}
