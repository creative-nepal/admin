import type { Translate } from "@/features/i18n/types";

export const PLATFORM_ROLES = ["user", "admin"] as const;

export const USER_SEARCH_FIELDS = ["email", "name"] as const;

export const USER_FILTER_VALUES = ["all", "admin", "user", "banned"] as const;

export const BAN_DURATION_VALUES = ["permanent", "1d", "7d", "30d"] as const;

export function userFilters(t: Translate) {
  return [
    { value: "all", label: t("ui.admin.users.allUsers") },
    {
      value: "admin",
      label: t("ui.admin.users.admins"),
      group: t("ui.field.role"),
    },
    {
      value: "user",
      label: t("ui.admin.users.regularUsers"),
      group: t("ui.field.role"),
    },
    {
      value: "banned",
      label: t("ui.admin.users.banned"),
      group: t("ui.field.status"),
    },
  ];
}

export const BAN_DURATION_SECONDS: Record<string, number | null> = {
  permanent: null,
  "1d": 60 * 60 * 24,
  "7d": 60 * 60 * 24 * 7,
  "30d": 60 * 60 * 24 * 30,
};

export function banDurations(t: Translate) {
  return [
    {
      value: "permanent",
      label: t("ui.admin.users.durationPermanent"),
      seconds: null,
    },
    {
      value: "1d",
      label: t("ui.admin.users.durationOneDay"),
      seconds: BAN_DURATION_SECONDS["1d"],
    },
    {
      value: "7d",
      label: t("ui.admin.users.durationDays", { count: 7 }),
      seconds: BAN_DURATION_SECONDS["7d"],
    },
    {
      value: "30d",
      label: t("ui.admin.users.durationDays", { count: 30 }),
      seconds: BAN_DURATION_SECONDS["30d"],
    },
  ];
}

export const MIN_PASSWORD_LENGTH = 8;

export const WORKSPACE_URL =
  process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";
