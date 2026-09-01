import { useMutation, useQueryClient } from "@tanstack/react-query";
import { overviewQueryKeys } from "@/features/overview/queries";
import { businessesQueryKeys } from "./queries";
import {
  assignSubscription,
  cancelSubscription,
  setBusinessCompliance,
  setBusinessStatus,
} from "./services";
import type { BusinessStatus } from "./types";

function useInvalidateBusinesses() {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: businessesQueryKeys.all });
    void queryClient.invalidateQueries({ queryKey: overviewQueryKeys.all });
  };
}

export function useSetBusinessStatus() {
  const invalidate = useInvalidateBusinesses();

  return useMutation({
    mutationFn: ({
      businessId,
      status,
    }: {
      businessId: string;
      status: BusinessStatus;
    }) => setBusinessStatus(businessId, status),
    onSuccess: invalidate,
  });
}

export function useSetBusinessCompliance() {
  const invalidate = useInvalidateBusinesses();

  return useMutation({
    mutationFn: ({
      businessId,
      ...patch
    }: {
      businessId: string;
      cbmsRequired?: boolean;
      vatRegistered?: boolean;
    }) => setBusinessCompliance(businessId, patch),
    onSuccess: invalidate,
  });
}

export function useAssignSubscription() {
  const invalidate = useInvalidateBusinesses();

  return useMutation({
    mutationFn: ({
      businessId,
      planId,
    }: {
      businessId: string;
      planId: string;
    }) => assignSubscription(businessId, planId),
    onSuccess: invalidate,
  });
}

export function useCancelSubscription() {
  const invalidate = useInvalidateBusinesses();

  return useMutation({
    mutationFn: ({
      businessId,
      immediate,
    }: {
      businessId: string;
      immediate: boolean;
    }) => cancelSubscription(businessId, immediate),
    onSuccess: invalidate,
  });
}
