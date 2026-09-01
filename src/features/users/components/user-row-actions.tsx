"use client";

import { RiMoreLine } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composed/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { authClient } from "@/lib/auth-client";
import { usePlatformPermissions } from "../hooks/use-platform-permissions";
import {
  useImpersonateUser,
  useRemoveUser,
  useSetUserRole,
  useUnbanUser,
} from "../mutations";
import type { AdminUser } from "../types";
import { BanUserDialog } from "./ban-user-dialog";
import { SetPasswordDialog } from "./set-password-dialog";
import { UserDetailsDialog } from "./user-details-dialog";
import { UserFormSheet } from "./user-form-sheet";
import { UserSessionsSheet } from "./user-sessions-sheet";

export function UserRowActions({ user }: { user: AdminUser }) {
  const { t } = useTranslation();

  const [banOpen, setBanOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const { can } = usePlatformPermissions();
  const setRole = useSetUserRole();
  const unbanUser = useUnbanUser();
  const removeUser = useRemoveUser();
  const impersonateUser = useImpersonateUser();

  const isSelf = session?.user.id === user.id;
  const isAdmin =
    (Array.isArray(user.role) ? user.role[0] : user.role) === "admin";

  const canEdit = can({ user: ["update"] });
  const canSetRole = can({ user: ["set-role"] });
  const canSetPassword = can({ user: ["set-password"] });
  const canListSessions = can({ session: ["list"] });
  const canImpersonate = can({ user: ["impersonate"] });
  const canBan = can({ user: ["ban"] });
  const canDelete = can({ user: ["delete"] });

  const hasAccessActions =
    canSetRole || canSetPassword || canListSessions || canImpersonate;
  const hasDangerActions = canBan || canDelete;

  function handleToggleRole() {
    const nextRole = isAdmin ? "user" : "admin";
    toast.promise(setRole.mutateAsync({ userId: user.id, role: nextRole }), {
      loading: "Updating role...",
      success: `${user.name} is now ${nextRole === "admin" ? "an admin" : "a regular user"}`,
      error: (error) =>
        error instanceof Error ? error.message : "Failed to update role",
    });
  }

  function handleUnban() {
    toast.promise(unbanUser.mutateAsync({ userId: user.id }), {
      loading: "Unbanning...",
      success: `${user.name} has been unbanned`,
      error: (error) =>
        error instanceof Error ? error.message : "Failed to unban user",
    });
  }

  function handleImpersonate() {
    toast.promise(impersonateUser.mutateAsync({ userId: user.id }), {
      loading: "Starting impersonation...",
      success: `You are now signed in as ${user.name}`,
      error: (error) =>
        error instanceof Error ? error.message : "Failed to impersonate user",
    });
  }

  async function handleRemove() {
    await removeUser.mutateAsync({ userId: user.id });
    toast.success(`${user.name} has been deleted`);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("ui.admin.users.rowActions")}
            >
              <RiMoreLine className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("ui.admin.users.profile")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
              {t("ui.action.viewDetails")}
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                {t("ui.admin.users.editDetails")}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          {hasAccessActions && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {t("ui.admin.users.access")}
                </DropdownMenuLabel>
                {canSetRole && (
                  <DropdownMenuItem
                    disabled={isSelf}
                    onClick={handleToggleRole}
                  >
                    {isAdmin ? "Remove admin role" : "Make admin"}
                  </DropdownMenuItem>
                )}
                {canSetPassword && (
                  <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
                    {t("ui.admin.users.setPassword")}
                  </DropdownMenuItem>
                )}
                {canListSessions && (
                  <DropdownMenuItem onClick={() => setSessionsOpen(true)}>
                    {t("ui.admin.users.activeSessions")}
                  </DropdownMenuItem>
                )}
                {canImpersonate && (
                  <DropdownMenuItem
                    disabled={isSelf}
                    onClick={handleImpersonate}
                  >
                    {t("ui.admin.users.impersonate")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}
          {hasDangerActions && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {t("ui.admin.users.dangerZone")}
                </DropdownMenuLabel>
                {canBan &&
                  (user.banned ? (
                    <DropdownMenuItem onClick={handleUnban}>
                      {t("ui.admin.users.unban")}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      disabled={isSelf}
                      variant="destructive"
                      onClick={() => setBanOpen(true)}
                    >
                      {t("ui.admin.users.ban")}
                    </DropdownMenuItem>
                  ))}
                {canDelete && (
                  <DropdownMenuItem
                    disabled={isSelf}
                    variant="destructive"
                    onClick={() => setRemoveOpen(true)}
                  >
                    {t("ui.admin.users.deleteUser")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <UserDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={user}
      />
      <UserFormSheet open={editOpen} onOpenChange={setEditOpen} user={user} />
      <SetPasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        user={user}
      />
      <UserSessionsSheet
        open={sessionsOpen}
        onOpenChange={setSessionsOpen}
        user={user}
      />
      <BanUserDialog open={banOpen} onOpenChange={setBanOpen} user={user} />
      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title={t("ui.admin.users.deleteUser")}
        description={`${user.name} and every session, account and membership they own will be permanently removed. This cannot be undone — ban them instead if you may want to restore access.`}
        confirmLabel={t("ui.admin.users.deleteUser")}
        variant="destructive"
        onConfirm={handleRemove}
      />
    </>
  );
}
