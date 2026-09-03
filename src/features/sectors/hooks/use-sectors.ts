"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { sectorsQueryOptions } from "../queries";
import type { SectorDescriptor, SectorTheme } from "../types";

export function useSectors(): {
  sectors: SectorDescriptor[];
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery(sectorsQueryOptions());
  return { sectors: data ?? [], isLoading };
}

export function useSectorOptions(): { value: string; label: string }[] {
  const { t } = useTranslation();
  const { sectors } = useSectors();

  return sectors.map((sector) => ({
    value: sector.key,
    label: t(sector.nameKey),
  }));
}

export function useSectorLabel(): (sector: string) => string {
  const { t } = useTranslation();
  const { sectors } = useSectors();

  return (sector: string) => {
    const found = sectors.find((entry) => entry.key === sector);
    return found ? t(found.nameKey) : sector;
  };
}

export function useSectorTheme(): (sector: string) => SectorTheme | undefined {
  const { sectors } = useSectors();

  return (sector: string) =>
    sectors.find((entry) => entry.key === sector)?.theme;
}
