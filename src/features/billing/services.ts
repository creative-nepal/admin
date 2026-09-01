import { api } from "@/lib/api";

export interface PlatformInvoiceRow {
  invoice: {
    id: string;
    userId: string;
    invoiceNumber: number | null;
    series: string;
    periodStart: string;
    periodEnd: string;
    totalCents: number;
    status: string;
    createdAt: string;
  };
  accountEmail: string | null;
}

export interface BillingRunSummary {
  examined: number;
  charged: number;
  failed: number;
  skippedNoPaymentMethod: number;
  suspended: number;
}

export async function listPlatformInvoices(): Promise<{
  data: PlatformInvoiceRow[];
  total: number;
  totals: Record<string, { count: number; cents: number }>;
}> {
  const { data } = await api.get("/api/v1/billing/platform/invoices", {
    params: { limit: 50, offset: 0 },
  });
  return data;
}

export async function runBilling(): Promise<BillingRunSummary> {
  const { data } = await api.post<BillingRunSummary>("/api/v1/billing/run", {});
  return data;
}

export async function consolidate(): Promise<{ closed: number }> {
  const { data } = await api.post<{ closed: number }>(
    "/api/v1/billing/consolidate",
    {},
  );
  return data;
}
