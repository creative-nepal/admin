import type {
  BAN_DURATION_VALUES,
  PLATFORM_ROLES,
  USER_FILTER_VALUES,
  USER_SEARCH_FIELDS,
} from "../constants";

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export type UserSearchField = (typeof USER_SEARCH_FIELDS)[number];

export type UserFilter = (typeof USER_FILTER_VALUES)[number];

export type BanDuration = (typeof BAN_DURATION_VALUES)[number];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string | string[] | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersResult {
  users: AdminUser[];
  total: number;
}

export interface UserSession {
  id: string;
  token: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}
