import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plansQueryKeys } from "./queries";
import { archivePlan, createPlan, updatePlan } from "./services";
import type { PlanInput } from "./types";

function useInvalidatePlans() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: plansQueryKeys.all });
  };
}

export function useCreatePlan() {
  const invalidate = useInvalidatePlans();

  return useMutation({
    mutationFn: (input: PlanInput) => createPlan(input),
    onSuccess: invalidate,
  });
}

export function useUpdatePlan() {
  const invalidate = useInvalidatePlans();

  return useMutation({
    mutationFn: ({
      planId,
      ...input
    }: { planId: string } & Omit<PlanInput, "sector" | "key">) =>
      updatePlan(planId, input),
    onSuccess: invalidate,
  });
}

export function useArchivePlan() {
  const invalidate = useInvalidatePlans();

  return useMutation({
    mutationFn: ({ planId }: { planId: string }) => archivePlan(planId),
    onSuccess: invalidate,
  });
}
