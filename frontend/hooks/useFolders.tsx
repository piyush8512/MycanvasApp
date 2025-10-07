import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { folderService } from "@/services/folderService";

export const useFolders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const createFolder = async (name: string, isStarred: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      const result = await folderService.createFolder(
        { name, isStarred },
        token
      );
      console.log("Folder created:", result);
      return result.folder;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create folder";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await folderService.getFolders(token);
      return response.folders;
    } catch (error) {
      console.error("Get folders error:", error);
      throw new Error("Failed to fetch folders");
    } finally {
      setLoading(false);
    }
  };

  return {
    createFolder,
    getAllFolders,
    loading,
    error,
  };
};
