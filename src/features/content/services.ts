import { api } from "@/lib/api";
import type { PaginatedResult } from "@/types/api";
import type {
  ContentLocale,
  ContentNavigation,
  ContentPage,
  ContentPageStatus,
  ContentPageTranslation,
} from "./types";

const BASE = "/api/v1/admin/content";

export interface ListContentPagesParams {
  status: ContentPageStatus | null;
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageIndex: number;
  pageSize: number;
}

export interface CreateContentPageInput {
  slug: string;
  title: string;
  navLabel?: string;
  locale?: ContentLocale;
}

export interface SaveTranslationInput {
  title: string;
  navLabel?: string;
  seo: Record<string, unknown>;
  blocks: unknown[];
}

export interface SaveNavigationInput {
  header: unknown[];
  footer: unknown[];
  tagline?: string;
  copyright?: string;
}

export async function listContentPages({
  status,
  search,
  sortBy,
  sortDirection,
  pageIndex,
  pageSize,
}: ListContentPagesParams): Promise<PaginatedResult<ContentPage>> {
  const { data } = await api.get<PaginatedResult<ContentPage>>(
    `${BASE}/pages`,
    {
      params: {
        status: status ?? undefined,
        search: search || undefined,
        sortBy,
        sortDirection,
        limit: pageSize,
        offset: pageIndex * pageSize,
      },
    },
  );
  return data;
}

export async function getContentPage(pageId: string): Promise<ContentPage> {
  const { data } = await api.get<ContentPage>(`${BASE}/pages/${pageId}`);
  return data;
}

export async function createContentPage(
  input: CreateContentPageInput,
): Promise<ContentPage> {
  const { data } = await api.post<ContentPage>(`${BASE}/pages`, input);
  return data;
}

export async function updateContentPage(
  pageId: string,
  input: { slug?: string },
): Promise<ContentPage> {
  const { data } = await api.patch<ContentPage>(
    `${BASE}/pages/${pageId}`,
    input,
  );
  return data;
}

export async function saveTranslation(
  pageId: string,
  locale: ContentLocale,
  input: SaveTranslationInput,
): Promise<ContentPageTranslation> {
  const { data } = await api.put<ContentPageTranslation>(
    `${BASE}/pages/${pageId}/translations/${locale}`,
    input,
  );
  return data;
}

export async function publishPage(pageId: string): Promise<ContentPage> {
  const { data } = await api.post<ContentPage>(
    `${BASE}/pages/${pageId}/publish`,
    {},
  );
  return data;
}

export async function unpublishPage(pageId: string): Promise<ContentPage> {
  const { data } = await api.post<ContentPage>(
    `${BASE}/pages/${pageId}/unpublish`,
    {},
  );
  return data;
}

export async function deleteContentPage(pageId: string): Promise<void> {
  await api.delete(`${BASE}/pages/${pageId}`);
}

export async function getNavigation(
  locale: ContentLocale,
): Promise<ContentNavigation> {
  const { data } = await api.get<ContentNavigation>(
    `${BASE}/navigation/${locale}`,
  );
  return data;
}

export async function saveNavigation(
  locale: ContentLocale,
  input: SaveNavigationInput,
): Promise<ContentNavigation> {
  const { data } = await api.put<ContentNavigation>(
    `${BASE}/navigation/${locale}`,
    input,
  );
  return data;
}
