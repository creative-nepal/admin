import type { Business } from "@/features/businesses/types";

export interface PlatformOverview {
  businesses: {
    total: number;
    byStatus: Record<string, number>;
    bySector: Record<string, number>;
  };
  subscriptions: {
    total: number;
    byStatus: Record<string, number>;
  };
  cbms: {
    pending: number;
    failed: number;
  };
  recentBusinesses: Business[];
}
