import type { Sector } from "@/features/businesses/types";
import { api } from "@/lib/api";
import type { PaginatedResult } from "@/types/api";
import type { Plan, PlanInput } from "./types";

export interface ListPlansParams {
  sector: Sector | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageIndex: number;
  pageSize: number;
}

export async function listPlans({
  sector,
  sortBy,
  sortDirection,
  pageIndex,
  pageSize,
}: ListPlansParams): Promise<PaginatedResult<Plan>> {
  const { data } = await api.get<PaginatedResult<Plan>>("/api/v1/plans", {
    params: {
      sector: sector ?? undefined,
      sortBy,
      sortDirection,
      limit: pageSize,
      offset: pageIndex * pageSize,
    },
  });
  return data;
}

export async function createPlan(input: PlanInput): Promise<Plan> {
  const { data } = await api.post<Plan>("/api/v1/plans", input);
  return data;
}

export async function updatePlan(
  planId: string,
  input: Omit<PlanInput, "sector" | "key">,
): Promise<Plan> {
  const { data } = await api.patch<Plan>(`/api/v1/plans/${planId}`, input);
  return data;
}

export async function archivePlan(planId: string): Promise<Plan> {
  const { data } = await api.patch<Plan>(`/api/v1/plans/${planId}/archive`, {});
  return data;
}
