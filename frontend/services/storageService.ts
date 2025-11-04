import { API_URL } from "@/constants/config";
import axios, { isAxiosError } from "axios";

// Helper function to create auth headers
const createAuthHeaders = (token: string, contentType = "application/json") => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": contentType,
  },
});

export const storageService = {
  /**
   * Asks the backend for a secure URL to upload a file to.
   */
  async getSignedUploadUrl(
    token: string,
    fileName: string,
    fileType: string
  ) {
    try {
      const response = await axios.post(
        `${API_URL}/api/storage/signed-url`,
        { fileName, fileType },
        createAuthHeaders(token)
      );
      return response.data; // { success: true, signedUrl: "...", path: "..." }
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw new Error("Could not get upload URL");
    }
  },

  /**
   * Uploads the actual file to Supabase using the signed URL.
   */
  async uploadFileToSupabase(
    signedUrl: string,
    file: Blob, // In React Native, this comes from fileBlob
    fileType: string
  ) {
    try {
      // --- THIS IS THE FIX ---
      // This fetch call must use 'PUT', which now matches the controller
      const response = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: file,
      });
      // --- END FIX ---

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase upload failed: ${errorText}`);
      }
      return response;
    } catch (error) {
      console.error("Error uploading file to Supabase:", error);
      throw new Error("File upload failed");
    }
  },

  /**
   * Asks the backend for the public URL of the file we just uploaded.
   */
  async getPublicUrl(token: string, path: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/storage/public-url`,
        { path },
        createAuthHeaders(token)
      );
      return response.data; // { success: true, publicUrl: "..." }
    } catch (error) {
      console.error("Error getting public URL:", error);
      throw new Error("Could not get public URL");
    }
  },

  /**
   * Asks the backend to delete a file from storage.
   */
  async deleteFile(token: string, path: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/storage/delete`, // Matches the POST route in storage.routes.js
        { path },
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Could not delete file");
    }
  },
};

