import type { PlatformPermissionRequest } from "@/lib/access-control";
import { authClient } from "@/lib/auth-client";
import type {
  AdminUser,
  ListUsersResult,
  PlatformRole,
  UserFilter,
  UserSearchField,
  UserSession,
} from "./types";

function unwrap<T>(
  result: { data: unknown; error: { message?: string } | null },
  fallback: string,
): T {
  if (result.error) {
    throw new Error(result.error.message ?? fallback);
  }

  return result.data as T;
}

function filterQuery(filter: UserFilter) {
  if (filter === "all") {
    return {};
  }

  if (filter === "banned") {
    return {
      filterField: "banned",
      filterOperator: "eq" as const,
      filterValue: true,
    };
  }

  return {
    filterField: "role",
    filterOperator: "eq" as const,
    filterValue: filter,
  };
}

export interface ListUsersParams {
  search: string;
  searchField: UserSearchField;
  filter: UserFilter;
  sortBy: "name" | "email" | "createdAt";
  sortDirection: "asc" | "desc";
  pageIndex: number;
  pageSize: number;
}

export async function listUsers({
  search,
  searchField,
  filter,
  sortBy,
  sortDirection,
  pageIndex,
  pageSize,
}: ListUsersParams): Promise<ListUsersResult> {
  return unwrap<ListUsersResult>(
    await authClient.admin.listUsers({
      query: {
        searchField,
        searchOperator: "contains",
        searchValue: search || undefined,
        sortBy,
        sortDirection,
        limit: pageSize,
        offset: pageIndex * pageSize,
        ...filterQuery(filter),
      },
    }),
    "Failed to load users",
  );
}

export async function getUser(userId: string): Promise<AdminUser> {
  return unwrap<AdminUser>(
    await authClient.admin.getUser({ query: { id: userId } }),
    "Failed to load user",
  );
}

export async function createUser(values: {
  name: string;
  email: string;
  password: string;
  role: PlatformRole;
}): Promise<AdminUser> {
  const data = unwrap<{ user: AdminUser }>(
    await authClient.admin.createUser(values),
    "Failed to create user",
  );

  return data.user;
}

export async function updateUser(
  userId: string,
  data: { name: string; email: string },
): Promise<AdminUser> {
  return unwrap<AdminUser>(
    await authClient.admin.updateUser({ userId, data }),
    "Failed to update user",
  );
}

export async function removeUser(userId: string): Promise<void> {
  unwrap(
    await authClient.admin.removeUser({ userId }),
    "Failed to remove user",
  );
}

export async function setUserRole(
  userId: string,
  role: PlatformRole,
): Promise<AdminUser> {
  const data = unwrap<{ user: AdminUser }>(
    await authClient.admin.setRole({ userId, role }),
    "Failed to update role",
  );

  return data.user;
}

export async function setUserPassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  unwrap(
    await authClient.admin.setUserPassword({ userId, newPassword }),
    "Failed to set password",
  );
}

export async function banUser(
  userId: string,
  banReason: string,
  banExpiresIn: number | null,
): Promise<AdminUser> {
  const data = unwrap<{ user: AdminUser }>(
    await authClient.admin.banUser({
      userId,
      banReason,
      ...(banExpiresIn === null ? {} : { banExpiresIn }),
    }),
    "Failed to ban user",
  );

  return data.user;
}

export async function unbanUser(userId: string): Promise<AdminUser> {
  const data = unwrap<{ user: AdminUser }>(
    await authClient.admin.unbanUser({ userId }),
    "Failed to unban user",
  );

  return data.user;
}

export async function listUserSessions(userId: string): Promise<UserSession[]> {
  const data = unwrap<{ sessions: UserSession[] }>(
    await authClient.admin.listUserSessions({ userId }),
    "Failed to load sessions",
  );

  return data.sessions;
}

export async function revokeUserSession(sessionToken: string): Promise<void> {
  unwrap(
    await authClient.admin.revokeUserSession({ sessionToken }),
    "Failed to revoke session",
  );
}

export async function revokeUserSessions(userId: string): Promise<void> {
  unwrap(
    await authClient.admin.revokeUserSessions({ userId }),
    "Failed to revoke sessions",
  );
}

export async function impersonateUser(userId: string): Promise<void> {
  unwrap(
    await authClient.admin.impersonateUser({ userId }),
    "Failed to impersonate user",
  );
}

export async function stopImpersonating(): Promise<void> {
  unwrap(
    await authClient.admin.stopImpersonating(),
    "Failed to stop impersonating",
  );
}

export async function hasPermission(
  permissions: PlatformPermissionRequest,
): Promise<boolean> {
  const { data, error } = await authClient.admin.hasPermission({ permissions });

  if (error) {
    return false;
  }

  return Boolean(data?.success);
}
