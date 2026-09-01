"use client";

import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiDeleteBin6Line,
} from "@remixicon/react";
import { EmptyState } from "@/components/composed/empty-state";
import { useFieldArray, useFormContext } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { type TranslationFormValues, toBlockFormValues } from "../schemas";
import { blockTypeOptions, type ContentBlockType, createBlock } from "../types";
import { BlockFields } from "./block-fields";

export function BlockEditor() {
  const { t } = useTranslation();
  const blockTypes = blockTypeOptions(t);

  const { control } = useFormContext<TranslationFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "blocks",
    keyName: "_uid",
  });

  function addBlock(type: ContentBlockType) {
    append(toBlockFormValues(createBlock(type)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-heading text-sm font-medium">
            {t("ui.admin.content.blocks")}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("ui.admin.content.blocksHint")}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="outline" size="sm">
                <RiAddLine /> {t("ui.admin.content.addBlock")}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {blockTypes.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => addBlock(option.value)}
              >
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {option.hint}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {fields.length === 0 ? (
        <EmptyState
          title={t("ui.admin.content.blocksEmptyTitle")}
          description={t("ui.admin.content.blocksEmptyBody")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field._uid} className="flex flex-col gap-3 border p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm font-medium">
                    {t(`ui.admin.content.blockType.${field.type}`)}
                  </span>
                  <span className="font-mono text-muted-foreground text-xs">
                    {field.id}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("ui.admin.content.moveUp")}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <RiArrowUpLine />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("ui.admin.content.moveDown")}
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <RiArrowDownLine />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t("ui.admin.content.removeBlock")}
                    onClick={() => remove(index)}
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </div>
              </div>
              <BlockFields index={index} type={field.type} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
