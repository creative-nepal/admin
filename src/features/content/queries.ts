import { queryOptions } from "@tanstack/react-query";
import {
  getContentPage,
  getNavigation,
  type ListContentPagesParams,
  listContentPages,
} from "./services";
import type { ContentLocale } from "./types";

export const contentQueryKeys = {
  all: ["content"] as const,
  pages: () => [...contentQueryKeys.all, "pages"] as const,
  list: (params: ListContentPagesParams) =>
    [...contentQueryKeys.pages(), "list", params] as const,
  detail: (pageId: string) =>
    [...contentQueryKeys.pages(), "detail", pageId] as const,
  navigation: (locale: ContentLocale) =>
    [...contentQueryKeys.all, "navigation", locale] as const,
};

export function contentPagesQueryOptions(params: ListContentPagesParams) {
  return queryOptions({
    queryKey: contentQueryKeys.list(params),
    queryFn: () => listContentPages(params),
    placeholderData: (previous) => previous,
  });
}

export function contentPageQueryOptions(pageId: string) {
  return queryOptions({
    queryKey: contentQueryKeys.detail(pageId),
    queryFn: () => getContentPage(pageId),
  });
}

export function navigationQueryOptions(locale: ContentLocale) {
  return queryOptions({
    queryKey: contentQueryKeys.navigation(locale),
    queryFn: () => getNavigation(locale),
  });
}
