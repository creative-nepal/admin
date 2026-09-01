"use client";

import { RiMoreLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composed/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useDeleteContentPage, usePublishPage } from "../mutations";
import { type ContentPage, HOME_SLUG } from "../types";

export function PageRowActions({ page }: { page: ContentPage }) {
  const { t } = useTranslation();

  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const publishPage = usePublishPage();
  const deletePage = useDeleteContentPage();
  const isHome = page.slug === HOME_SLUG;
  const isPublished = page.status === "published";

  async function handlePublishToggle() {
    try {
      await publishPage.mutateAsync({ pageId: page.id, publish: !isPublished });
      toast.success(
        isPublished
          ? t("ui.admin.content.unpublished")
          : t("ui.admin.content.published"),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("ui.admin.content.statusChangeFailed"),
      );
    }
  }

  async function handleDelete() {
    await deletePage.mutateAsync({ pageId: page.id });
    toast.success(t("ui.admin.content.deleted", { slug: page.slug }));
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ui.admin.content.pageActions")}
            >
              <RiMoreLine className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/content/${page.id}`)}>
            {t("ui.admin.content.editContent")}
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <a
                href={`/api/preview?slug=${encodeURIComponent(page.slug)}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                {t("ui.admin.content.previewDraft")}
              </a>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isHome && isPublished}
            onClick={handlePublishToggle}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={isHome}
            onClick={() => setDeleteOpen(true)}
          >
            {t("ui.action.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("ui.admin.content.deleteTitle")}
        description={t("ui.admin.content.deleteBody", { slug: page.slug })}
        confirmLabel={t("ui.action.delete")}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
