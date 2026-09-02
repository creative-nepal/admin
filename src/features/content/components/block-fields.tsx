"use client";

import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react";
import { useFieldArray, useFormContext } from "@/components/form/form";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSectorOptions } from "@/features/sectors/hooks/use-sectors";
import type { TranslationFormValues } from "../schemas";
import type { ContentBlockType } from "../types";

type ItemsPath = `blocks.${number}.items`;

function useItems(index: number) {
  const { control } = useFormContext<TranslationFormValues>();

  return useFieldArray({
    control,
    name: `blocks.${index}.items` as ItemsPath,
    keyName: "_uid",
  });
}

function ItemActions({
  onAdd,
  onRemove,
  canRemove,
  addLabel,
}: {
  onAdd: () => void;
  onRemove: () => void;
  canRemove: boolean;
  addLabel: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <Button type="button" variant="ghost" size="xs" onClick={onAdd}>
        <RiAddLine /> {addLabel}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={t("ui.admin.content.removeItem")}
        disabled={!canRemove}
        onClick={onRemove}
      >
        <RiDeleteBin6Line />
      </Button>
    </div>
  );
}

function FeatureItems({ index }: { index: number }) {
  const { t } = useTranslation();

  const { fields, append, remove } = useItems(index);

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, itemIndex) => (
        <div key={field._uid} className="flex flex-col gap-2 border p-3">
          <TextField
            name={`blocks.${index}.items.${itemIndex}.title`}
            label={t("ui.field.title")}
          />
          <TextareaField
            name={`blocks.${index}.items.${itemIndex}.body`}
            label={t("ui.admin.content.body")}
            rows={3}
          />
          <ItemActions
            addLabel="Add feature"
            onAdd={() => append({ title: "", body: "", icon: "" })}
            onRemove={() => remove(itemIndex)}
            canRemove={fields.length > 1}
          />
        </div>
      ))}
      {fields.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ title: "", body: "", icon: "" })}
        >
          <RiAddLine /> {t("ui.admin.content.addFeature")}
        </Button>
      )}
    </div>
  );
}

function FaqItems({ index }: { index: number }) {
  const { t } = useTranslation();

  const { fields, append, remove } = useItems(index);

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, itemIndex) => (
        <div key={field._uid} className="flex flex-col gap-2 border p-3">
          <TextField
            name={`blocks.${index}.items.${itemIndex}.question`}
            label={t("ui.admin.content.question")}
          />
          <TextareaField
            name={`blocks.${index}.items.${itemIndex}.answer`}
            label={t("ui.admin.content.answer")}
            rows={3}
          />
          <ItemActions
            addLabel="Add question"
            onAdd={() => append({ question: "", answer: "" })}
            onRemove={() => remove(itemIndex)}
            canRemove={fields.length > 1}
          />
        </div>
      ))}
      {fields.length === 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ question: "", answer: "" })}
        >
          <RiAddLine /> {t("ui.admin.content.addQuestion")}
        </Button>
      )}
    </div>
  );
}

export function BlockFields({
  index,
  type,
}: {
  index: number;
  type: ContentBlockType;
}) {
  const { t } = useTranslation();
  const sectorOptions = useSectorOptions();

  switch (type) {
    case "hero":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <TextareaField
            name={`blocks.${index}.subheading`}
            label={t("ui.admin.content.subheading")}
            rows={3}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              name={`blocks.${index}.ctaLabel`}
              label={t("ui.admin.content.primaryButton")}
            />
            <TextField
              name={`blocks.${index}.ctaHref`}
              label={t("ui.admin.content.primaryLink")}
              placeholder="/register"
            />
            <TextField
              name={`blocks.${index}.secondaryCtaLabel`}
              label={t("ui.admin.content.secondaryButton")}
            />
            <TextField
              name={`blocks.${index}.secondaryCtaHref`}
              label={t("ui.admin.content.secondaryLink")}
              placeholder="/pricing"
            />
          </div>
          <TextField
            name={`blocks.${index}.imageUrl`}
            label={t("ui.admin.content.imageUrl")}
            description={t("ui.admin.content.imageUrlHint")}
          />
        </>
      );
    case "features":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <TextareaField
            name={`blocks.${index}.subheading`}
            label={t("ui.admin.content.subheading")}
            rows={2}
          />
          <FeatureItems index={index} />
        </>
      );
    case "richText":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <TextareaField
            name={`blocks.${index}.markdown`}
            label={t("ui.admin.content.markdown")}
            description={t("ui.admin.content.markdownHint")}
            rows={12}
            className="font-mono"
          />
        </>
      );
    case "faq":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <FaqItems index={index} />
        </>
      );
    case "cta":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <TextareaField
            name={`blocks.${index}.body`}
            label={t("ui.admin.content.body")}
            rows={2}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              name={`blocks.${index}.buttonLabel`}
              label={t("ui.admin.content.buttonLabel")}
            />
            <TextField
              name={`blocks.${index}.buttonHref`}
              label={t("ui.admin.content.buttonLink")}
              placeholder="/register"
            />
          </div>
        </>
      );
    case "pricing":
      return (
        <>
          <TextField
            name={`blocks.${index}.heading`}
            label={t("ui.admin.content.heading")}
          />
          <TextareaField
            name={`blocks.${index}.subheading`}
            label={t("ui.admin.content.subheading")}
            rows={2}
          />
          <SelectField
            name={`blocks.${index}.sector`}
            label={t("ui.field.sector")}
            description={t("ui.admin.content.pricingSectorHint")}
            options={sectorOptions}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              name={`blocks.${index}.ctaLabel`}
              label={t("ui.admin.content.buttonLabel")}
            />
            <TextField
              name={`blocks.${index}.ctaHref`}
              label={t("ui.admin.content.buttonLink")}
              placeholder="/register"
            />
          </div>
        </>
      );
  }
}
