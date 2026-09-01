"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/composed/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewSkeleton } from "@/components/view-skeleton";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { NavigationForm } from "../components/navigation-form";
import { navigationQueryOptions } from "../queries";
import { type ContentLocale, LOCALE_OPTIONS } from "../types";

export function NavigationView() {
  const { t } = useTranslation();

  const [locale, setLocale] = useState<ContentLocale>("en");
  const { data: navigation, isPending } = useQuery(
    navigationQueryOptions(locale),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("ui.admin.content.navigation")}
        description={t("ui.admin.content.navigationDescription")}
        actions={
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/content" />}
            nativeButton={false}
          >
            <RiArrowLeftLine /> {t("ui.admin.content.allPages")}
          </Button>
        }
      />
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
        <TabsContent value={locale}>
          {isPending ? (
            <ViewSkeleton />
          ) : (
            <NavigationForm locale={locale} navigation={navigation} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
