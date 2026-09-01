import { api } from "@/lib/api";
import type { PlatformOverview } from "./types";

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const { data } = await api.get<PlatformOverview>("/api/v1/platform/overview");
  return data;
}
