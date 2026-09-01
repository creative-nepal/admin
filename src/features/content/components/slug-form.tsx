"use client";

import { toast } from "sonner";
import { z } from "zod";
import { Form } from "@/components/form/form";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useUpdateContentPage } from "../mutations";
import { pageCreateSchema } from "../schemas";
import { type ContentPage, HOME_SLUG } from "../types";

const slugFormSchema = z.object({ slug: pageCreateSchema.shape.slug });

type SlugFormValues = z.infer<typeof slugFormSchema>;

export function SlugForm({ page }: { page: ContentPage }) {
  const { t } = useTranslation();

  const updatePage = useUpdateContentPage();

  if (page.slug === HOME_SLUG) {
    return null;
  }

  async function handleSubmit(values: SlugFormValues) {
    try {
      await updatePage.mutateAsync({ pageId: page.id, slug: values.slug });
      toast.success(t("ui.admin.content.moved", { slug: values.slug }));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("ui.admin.content.slugFailed"),
      );
    }
  }

  return (
    <Form
      key={page.slug}
      schema={slugFormSchema}
      defaultValues={{ slug: page.slug }}
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border p-4"
    >
      <TextField
        name="slug"
        label={t("ui.admin.content.slug")}
        description={t("ui.admin.content.slugChangeHint")}
        className="max-w-xs"
      />
      <Button type="submit" variant="outline" disabled={updatePage.isPending}>
        {t("ui.admin.content.saveSlug")}
      </Button>
    </Form>
  );
}
