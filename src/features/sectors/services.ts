import { api } from "@/lib/api";
import type { SectorDescriptor } from "./types";

export async function listSectors(): Promise<SectorDescriptor[]> {
  const { data } = await api.get<SectorDescriptor[]>(
    "/api/v1/platform/sectors",
  );
  return data;
}
