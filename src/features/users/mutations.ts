import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "./queries";
import {
  banUser,
  createUser,
  impersonateUser,
  removeUser,
  revokeUserSession,
  revokeUserSessions,
  setUserPassword,
  setUserRole,
  stopImpersonating,
  unbanUser,
  updateUser,
} from "./services";
import type { PlatformRole } from "./types";

function useUsersMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}

export function useCreateUser() {
  return useUsersMutation(createUser);
}

export function useUpdateUser() {
  return useUsersMutation(
    ({ userId, ...data }: { userId: string; name: string; email: string }) =>
      updateUser(userId, data),
  );
}

export function useRemoveUser() {
  return useUsersMutation(({ userId }: { userId: string }) =>
    removeUser(userId),
  );
}

export function useSetUserRole() {
  return useUsersMutation(
    ({ userId, role }: { userId: string; role: PlatformRole }) =>
      setUserRole(userId, role),
  );
}

export function useSetUserPassword() {
  return useUsersMutation(
    ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      setUserPassword(userId, newPassword),
  );
}

export function useBanUser() {
  return useUsersMutation(
    ({
      userId,
      banReason,
      banExpiresIn,
    }: {
      userId: string;
      banReason: string;
      banExpiresIn: number | null;
    }) => banUser(userId, banReason, banExpiresIn),
  );
}

export function useUnbanUser() {
  return useUsersMutation(({ userId }: { userId: string }) =>
    unbanUser(userId),
  );
}

export function useRevokeUserSession() {
  return useUsersMutation(({ sessionToken }: { sessionToken: string }) =>
    revokeUserSession(sessionToken),
  );
}

export function useRevokeUserSessions() {
  return useUsersMutation(({ userId }: { userId: string }) =>
    revokeUserSessions(userId),
  );
}

export function useImpersonateUser() {
  return useUsersMutation(({ userId }: { userId: string }) =>
    impersonateUser(userId),
  );
}

export function useStopImpersonating() {
  return useUsersMutation(() => stopImpersonating());
}
