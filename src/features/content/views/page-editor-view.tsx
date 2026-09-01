"use client";

import { RiArrowLeftLine, RiExternalLinkLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/composed/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewSkeleton } from "@/components/view-skeleton";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { PageStatusBadge } from "../components/page-status-badge";
import { SlugForm } from "../components/slug-form";
import { TranslationForm } from "../components/translation-form";
import { usePublishPage } from "../mutations";
import { contentPageQueryOptions } from "../queries";
import { type ContentLocale, HOME_SLUG, LOCALE_OPTIONS } from "../types";

export function PageEditorView({ pageId }: { pageId: string }) {
  const { t } = useTranslation();

  const [locale, setLocale] = useState<ContentLocale>("en");
  const { data: page, isPending } = useQuery(contentPageQueryOptions(pageId));
  const publishPage = usePublishPage();

  if (isPending || !page) {
    return <ViewSkeleton />;
  }

  const isPublished = page.status === "published";

  async function handlePublishToggle() {
    if (!page) {
      return;
    }

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

  const title =
    page.translations.find((translation) => translation.locale === "en")
      ?.title ?? page.slug;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        description={t("ui.admin.content.publicUrl", {
          slug: page.slug === HOME_SLUG ? "" : page.slug,
        })}
        actions={
          <div className="flex items-center gap-2">
            <PageStatusBadge status={page.status} />
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/content" />}
              nativeButton={false}
            >
              <RiArrowLeftLine /> {t("ui.admin.content.allPages")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={
                <a
                  href={`/api/preview?slug=${encodeURIComponent(page.slug)}`}
                  rel="noreferrer noopener"
                  target="_blank"
                />
              }
              nativeButton={false}
            >
              <RiExternalLinkLine /> {t("ui.action.preview")}
            </Button>
            <Button
              size="sm"
              variant={isPublished ? "outline" : "default"}
              disabled={
                publishPage.isPending ||
                (isPublished && page.slug === HOME_SLUG)
              }
              onClick={handlePublishToggle}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        }
      />

      <SlugForm page={page} />

      <Tabs
        value={locale}
        onValueChange={(value) => setLocale(value as ContentLocale)}
      >
        <TabsList>
          {LOCALE_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALE_OPTIONS.map((option) => (
          <TabsContent key={option.value} value={option.value}>
            <TranslationForm page={page} locale={option.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
