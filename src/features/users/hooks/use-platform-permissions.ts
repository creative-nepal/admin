"use client";

import { useMemo } from "react";
import type { PlatformPermissionRequest } from "@/lib/access-control";
import { authClient } from "@/lib/auth-client";
import type { PlatformRole } from "../types";

export function usePlatformPermissions() {
  const { data: session, isPending } = authClient.useSession();

  return useMemo(() => {
    const role = session?.user.role;
    const roles = (Array.isArray(role) ? role : [role]).filter(
      (value): value is PlatformRole => value === "admin" || value === "user",
    );

    return {
      isPending,
      role: roles[0] ?? null,
      isImpersonating: Boolean(session?.session.impersonatedBy),
      can: (permissions: PlatformPermissionRequest) =>
        roles.some((value) =>
          authClient.admin.checkRolePermission({
            role: value,
            permissions,
          }),
        ),
    };
  }, [session, isPending]);
}
