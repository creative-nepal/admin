import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contentQueryKeys } from "./queries";
import {
  type CreateContentPageInput,
  createContentPage,
  deleteContentPage,
  publishPage,
  type SaveNavigationInput,
  type SaveTranslationInput,
  saveNavigation,
  saveTranslation,
  unpublishPage,
  updateContentPage,
} from "./services";
import type { ContentLocale } from "./types";

function useInvalidateContent() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: contentQueryKeys.all });
  };
}

export function useCreateContentPage() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: (input: CreateContentPageInput) => createContentPage(input),
    onSuccess: invalidate,
  });
}

export function useUpdateContentPage() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: ({ pageId, slug }: { pageId: string; slug: string }) =>
      updateContentPage(pageId, { slug }),
    onSuccess: invalidate,
  });
}

export function useSaveTranslation() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: ({
      pageId,
      locale,
      ...input
    }: { pageId: string; locale: ContentLocale } & SaveTranslationInput) =>
      saveTranslation(pageId, locale, input),
    onSuccess: invalidate,
  });
}

export function usePublishPage() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: ({ pageId, publish }: { pageId: string; publish: boolean }) =>
      publish ? publishPage(pageId) : unpublishPage(pageId),
    onSuccess: invalidate,
  });
}

export function useDeleteContentPage() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: ({ pageId }: { pageId: string }) => deleteContentPage(pageId),
    onSuccess: invalidate,
  });
}

export function useSaveNavigation() {
  const invalidate = useInvalidateContent();

  return useMutation({
    mutationFn: ({
      locale,
      ...input
    }: { locale: ContentLocale } & SaveNavigationInput) =>
      saveNavigation(locale, input),
    onSuccess: invalidate,
  });
}
