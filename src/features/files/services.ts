import { api } from "@/lib/api";
import type { FilePurpose, StoredFile, UploadTicket } from "./types";

export function publicFileUrl(fileId: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}/api/v1/public/files/${fileId}`;
}

export async function uploadPlatformFile(
  file: File,
  purpose: FilePurpose = "content-image",
): Promise<{ id: string; url: string }> {
  const { data: ticket } = await api.post<UploadTicket>(
    "/api/v1/platform/files",
    {
      purpose,
      originalName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    },
  );

  const response = await fetch(ticket.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`);
  }

  const { data: stored } = await api.post<StoredFile>(
    `/api/v1/platform/files/${ticket.file.id}/complete`,
    {},
  );

  return { id: stored.id, url: publicFileUrl(stored.id) };
}

export async function listPlatformFiles(
  purpose?: FilePurpose,
): Promise<StoredFile[]> {
  const { data } = await api.get<{ data: StoredFile[] }>(
    "/api/v1/platform/files",
    { params: { limit: 100, ...(purpose ? { purpose } : {}) } },
  );
  return data.data;
}

export async function deletePlatformFile(fileId: string): Promise<void> {
  await api.delete(`/api/v1/platform/files/${fileId}`);
}
