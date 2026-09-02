"use client";

import { FileUpload } from "@/components/composed/file-upload";
import { useFormContext, useWatch } from "@/components/form/form";
import { TextField } from "@/components/form/text-field";
import { uploadPlatformFile } from "@/features/files/services";
import { useTranslation } from "@/features/i18n/hooks/use-translation";

/**
 * An image URL that an author can either paste or upload. Upload writes the
 * public file URL into the same field, so the stored block shape is unchanged
 * and existing pasted URLs keep working.
 */
export function ImageField({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description?: string;
}) {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const current = useWatch({ name }) as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      <TextField name={name} label={label} description={description} />
      <FileUpload
        label={t("ui.admin.content.uploadImage")}
        replaceLabel={t("ui.admin.content.replaceImage")}
        clearLabel={t("ui.action.cancel")}
        value={current ? { id: current, url: current } : null}
        onChange={(next) =>
          setValue(name, next?.url ?? "", { shouldDirty: true })
        }
        onUpload={(file) => uploadPlatformFile(file, "content-image")}
      />
    </div>
  );
}
