import { LANGUAGE_HEADER } from "@/features/i18n/constants";
import { createApiClient } from "@/lib/api-client/axios";
import { getCurrentLanguage } from "@/stores/language-store";

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  getAuthHeaders: (): Record<string, string> => ({
    [LANGUAGE_HEADER]: getCurrentLanguage(),
  }),
});
