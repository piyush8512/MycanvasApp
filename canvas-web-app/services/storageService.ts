import { API_BASE_URL } from "@/services/api";

const API_URL = API_BASE_URL;

const createAuthHeaders = (token: string, contentType = "application/json") => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": contentType,
});

interface SignedUploadResponse {
  success: boolean;
  signedUrl: string;
  path: string;
  token?: string;
}

interface PublicUrlResponse {
  success: boolean;
  publicUrl: string;
}

export const storageService = {
  async getSignedUploadUrl(
    token: string,
    fileName: string,
    fileType: string,
  ): Promise<SignedUploadResponse> {
    const res = await fetch(`${API_URL}/storage/signed-url`, {
      method: "POST",
      headers: createAuthHeaders(token),
      body: JSON.stringify({ fileName, fileType }),
    });

    if (!res.ok) {
      const errorPayload = await res
        .json()
        .catch(() => ({ message: "Could not get upload URL" }));
      throw new Error(
        errorPayload?.error || errorPayload?.message || "Could not get upload URL",
      );
    }

    return res.json();
  },

  async uploadFileToSupabase(
    signedUrl: string,
    file: Blob,
    fileType: string,
  ): Promise<void> {
    const res = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: file,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Upload failed");
      throw new Error(`Supabase upload failed: ${errorText}`);
    }
  },

  async getPublicUrl(token: string, path: string): Promise<PublicUrlResponse> {
    const res = await fetch(`${API_URL}/storage/public-url`, {
      method: "POST",
      headers: createAuthHeaders(token),
      body: JSON.stringify({ path }),
    });

    if (!res.ok) {
      const errorPayload = await res
        .json()
        .catch(() => ({ message: "Could not get public URL" }));
      throw new Error(
        errorPayload?.error || errorPayload?.message || "Could not get public URL",
      );
    }

    return res.json();
  },
};
