import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { offlineFolderService } from "@/services/offlineFolderService";
import { folderService } from "@/services/folderService";
import { useNetworkStatus } from "./useNetworkStatus";

export const useFolders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { isConnected } = useNetworkStatus();
  const isOnline = isConnected;

  const createFolder = async (name: string, isStarred: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      const result = await offlineFolderService.createFolder(
        { name, isStarred },
        token,
        isOnline
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

      const response = await offlineFolderService.getFolders(token, isOnline);
      return response.folders;
    } catch (error) {
      console.error("Get folders error:", error);
      // Don't throw error if offline - return empty array instead
      if (!isOnline) {
        return [];
      }
      throw new Error("Failed to fetch folders");
    } finally {
      setLoading(false);
    }
  };

  //get folder by id
  const getFolderById = async (folderId: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const response = await folderService.getFolderById(folderId, token);
      return response.folder;
    } catch (error) {
      console.error("Get folder by ID error:", error);
      throw new Error("Failed to fetch folder details");
    } finally {
      setLoading(false);
    }
  };

  const deleteFolderById = async (folderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const response = await folderService.deleteFolder(folderId, token);
      return response.folder;
    } catch (error) {
      console.error("Delete folder by ID error:", error);
      throw new Error("Failed to delete folder");
    } finally {
      setLoading(false);
    }
  };

  const updateFolder = async (folderId: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const response = await folderService.updateFolder(folderId, data, token);
      return response.folder;
    } catch (error) {
      console.error("Update folder by ID error:", error);
      throw new Error("Failed to update folder");
    } finally {
      setLoading(false);
    }
  };

  return {
    createFolder,
    getAllFolders,
    getFolderById,
    deleteFolderById,
    updateFolder,
    loading,
    error,
  };
};
