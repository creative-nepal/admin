"use client";

import {
  RiBarChart2Line,
  RiBillLine,
  RiBuildingLine,
  RiFileTextLine,
  RiPriceTag3Line,
  RiShieldStarLine,
  RiUserLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
  DashboardShell,
  type DashboardShellNavItem,
} from "@/components/composed/dashboard-shell";
import { QueryBoundary } from "@/components/query-boundary";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/features/auth/components/user-menu";
import { LanguageSwitcher } from "@/features/i18n/components/language-switcher";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { ImpersonationBanner } from "@/features/users/components/impersonation-banner";
import { useSidebarStore } from "@/stores/sidebar-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems: Omit<DashboardShellNavItem, "isActive">[] = [
    { title: t("ui.admin.nav.overview"), href: "/", icon: <RiBarChart2Line /> },
    {
      title: t("ui.admin.nav.businesses"),
      href: "/businesses",
      icon: <RiBuildingLine />,
    },
    {
      title: t("ui.admin.nav.plans"),
      href: "/plans",
      icon: <RiPriceTag3Line />,
    },
    {
      title: t("ui.admin.nav.content"),
      href: "/content",
      icon: <RiFileTextLine />,
    },
    {
      title: t("ui.admin.nav.billing"),
      href: "/billing",
      icon: <RiBillLine />,
    },
    { title: t("ui.admin.nav.users"), href: "/users", icon: <RiUserLine /> },
  ];
  const open = useSidebarStore((state) => state.open);
  const setOpen = useSidebarStore((state) => state.setOpen);

  const items: DashboardShellNavItem[] = navItems.map((item) => ({
    ...item,
    isActive:
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  }));

  return (
    <DashboardShell
      navItems={items}
      navGroupLabel={t("ui.admin.nav.group")}
      collapsible="icon"
      header={
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
            <RiShieldStarLine className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">{t("ui.brand.name")}</span>
            <span className="truncate text-xs">{t("ui.brand.admin")}</span>
          </div>
        </div>
      }
      headerActions={
        <>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </>
      }
      footer={<UserMenu />}
      open={open}
      onOpenChange={setOpen}
      renderLink={(item, button) => <Link href={item.href}>{button}</Link>}
    >
      <ImpersonationBanner />
      <QueryBoundary>{children}</QueryBoundary>
    </DashboardShell>
  );
}
