"use client";

import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react";
import { toast } from "sonner";
import { Form, useFieldArray, useFormContext } from "@/components/form/form";
import { SwitchField } from "@/components/form/switch-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSaveNavigation } from "../mutations";
import {
  type NavigationFormValues,
  navigationFormSchema,
  toNavigationFormValues,
  toNavigationPayload,
} from "../schemas";
import {
  type ContentLocale,
  type ContentNavigation,
  createFooterGroup,
  createNavLink,
} from "../types";

function HeaderLinks() {
  const { t } = useTranslation();

  const { control } = useFormContext<NavigationFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "header",
    keyName: "_uid",
  });

  return (
    <div className="flex flex-col gap-3 border p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-heading text-sm font-medium">
            {t("ui.admin.content.headerLinks")}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("ui.admin.content.headerLinksHint")}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...createNavLink(), external: false })}
        >
          <RiAddLine /> {t("ui.admin.content.addLink")}
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={field._uid}
          className="flex flex-wrap items-end gap-3 border p-3"
        >
          <TextField
            name={`header.${index}.label`}
            label={t("ui.admin.content.linkLabel")}
            className="max-w-48"
          />
          <TextField
            name={`header.${index}.href`}
            label={t("ui.admin.content.link")}
            placeholder="/pricing"
            className="max-w-64"
          />
          <SwitchField
            name={`header.${index}.external`}
            label={t("ui.admin.content.external")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("ui.admin.content.removeLink")}
            onClick={() => remove(index)}
          >
            <RiDeleteBin6Line />
          </Button>
        </div>
      ))}
    </div>
  );
}

function FooterGroupLinks({ groupIndex }: { groupIndex: number }) {
  const { t } = useTranslation();
  const { control } = useFormContext<NavigationFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `footer.${groupIndex}.links`,
    keyName: "_uid",
  });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field._uid} className="flex flex-wrap items-end gap-3">
          <TextField
            name={`footer.${groupIndex}.links.${index}.label`}
            label={t("ui.admin.content.linkLabel")}
            className="max-w-48"
          />
          <TextField
            name={`footer.${groupIndex}.links.${index}.href`}
            label={t("ui.admin.content.link")}
            className="max-w-64"
          />
          <SwitchField
            name={`footer.${groupIndex}.links.${index}.external`}
            label={t("ui.admin.content.external")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("ui.admin.content.removeLink")}
            onClick={() => remove(index)}
          >
            <RiDeleteBin6Line />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="self-start"
        onClick={() => append({ ...createNavLink(), external: false })}
      >
        <RiAddLine /> {t("ui.admin.content.addLink")}
      </Button>
    </div>
  );
}

function FooterGroups() {
  const { t } = useTranslation();

  const { control } = useFormContext<NavigationFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "footer",
    keyName: "_uid",
  });

  return (
    <div className="flex flex-col gap-3 border p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-heading text-sm font-medium">
            {t("ui.admin.content.footerGroups")}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("ui.admin.content.footerGroupsHint")}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              ...createFooterGroup(),
              links: [{ ...createNavLink(), external: false }],
            })
          }
        >
          <RiAddLine /> {t("ui.admin.content.addGroup")}
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field._uid} className="flex flex-col gap-3 border p-3">
          <div className="flex items-end justify-between gap-3">
            <TextField
              name={`footer.${index}.label`}
              label={t("ui.admin.content.groupLabel")}
              className="max-w-48"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("ui.admin.content.removeGroup")}
              onClick={() => remove(index)}
            >
              <RiDeleteBin6Line />
            </Button>
          </div>
          <FooterGroupLinks groupIndex={index} />
        </div>
      ))}
    </div>
  );
}

export function NavigationForm({
  locale,
  navigation,
}: {
  locale: ContentLocale;
  navigation: ContentNavigation | undefined;
}) {
  const { t } = useTranslation();
  const saveNavigation = useSaveNavigation();

  async function handleSubmit(values: NavigationFormValues) {
    try {
      await saveNavigation.mutateAsync({
        locale,
        ...toNavigationPayload(values),
      });
      toast.success(
        t("ui.admin.content.navigationSaved", { locale: locale.toUpperCase() }),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("ui.admin.content.navigationFailed"),
      );
    }
  }

  return (
    <Form
      key={locale}
      schema={navigationFormSchema}
      defaultValues={toNavigationFormValues(navigation)}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-3 border p-4 sm:grid-cols-2">
        <TextField
          name="tagline"
          label={t("ui.admin.content.footerTagline")}
          placeholder={t("ui.brand.tagline")}
        />
        <TextField
          name="copyright"
          label={t("ui.admin.content.copyrightName")}
          placeholder={t("ui.brand.name")}
        />
      </div>
      <HeaderLinks />
      <FooterGroups />
      <div className="flex justify-end">
        <Button type="submit" disabled={saveNavigation.isPending}>
          {t("ui.admin.content.saveNavigation", {
            locale: locale.toUpperCase(),
          })}
        </Button>
      </div>
    </Form>
  );
}
