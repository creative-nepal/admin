import { queryOptions } from "@tanstack/react-query";
import type { PlatformPermissionRequest } from "@/lib/access-control";
import {
  getUser,
  hasPermission,
  type ListUsersParams,
  listUserSessions,
  listUsers,
} from "./services";

export const usersQueryKeys = {
  all: ["users"] as const,
  list: (params: ListUsersParams) =>
    [...usersQueryKeys.all, "list", params] as const,
  detail: (userId: string) =>
    [...usersQueryKeys.all, "detail", userId] as const,
  sessions: (userId: string) =>
    [...usersQueryKeys.all, "sessions", userId] as const,
  permission: (permissions: PlatformPermissionRequest) =>
    [...usersQueryKeys.all, "permission", permissions] as const,
};

export function usersQueryOptions(params: ListUsersParams) {
  return queryOptions({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => listUsers(params),
    placeholderData: (previous) => previous,
  });
}

export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: usersQueryKeys.detail(userId),
    queryFn: () => getUser(userId),
  });
}

export function userSessionsQueryOptions(userId: string, enabled: boolean) {
  return queryOptions({
    queryKey: usersQueryKeys.sessions(userId),
    queryFn: () => listUserSessions(userId),
    enabled,
  });
}

export function permissionQueryOptions(permissions: PlatformPermissionRequest) {
  return queryOptions({
    queryKey: usersQueryKeys.permission(permissions),
    queryFn: () => hasPermission(permissions),
    staleTime: 60_000,
  });
}
