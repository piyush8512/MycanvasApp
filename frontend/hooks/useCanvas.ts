// import { useState } from "react";
// import { useAuth } from "@clerk/clerk-expo";
// import { canvasService } from "@/services/canvasService";

// export const useCanvas = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { getToken } = useAuth();

//   const createCanvas = async (
//     name: string,
//     isStarred: boolean = false,
//     folderId: string
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) throw new Error("No authentication token");

//       const result = await canvasService.createCanvas(
//         { name, isStarred, folderId },
//         token
//       );
//       console.log("Folder created:", result);
//       return result.canvas;
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : "Failed to create folder";
//       setError(message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { canvasService } from "@/services/canvasService";

export const useCanvas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const createCanvas = async (
    name: string,
    isStarred: boolean = false,
    folderId?: string // Make it optional instead of required
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");

      // Only include folderId in the data object if it exists
      const canvasData: {
        name: string;
        isStarred: boolean;
        folderId?: string;
      } = {
        name,
        isStarred,
      };

      // Only add folderId if it's provided and not empty
      if (folderId && folderId.trim() !== "") {
        canvasData.folderId = folderId;
      }

      const result = await canvasService.createCanvas(canvasData, token);
      console.log("Canvas created:", result);
      return result.canvas;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create canvas";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCanvasById = async (canvasId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const response = await canvasService.deleteCanvas(canvasId, token);
      return response.canvas;
    } catch (error) {
      console.error("Delete canvas by ID error:", error);
      throw new Error("Failed to delete canvas by ID");
    } finally {
      setLoading(false);
    }
  };

  //fetch all canvas
  const getAllCanvas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      const result = await canvasService.getCanvas(token);
      console.log("Canvas fetched:", result);
      return result.canvas;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch canvas";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //get canvas by id
  const canvasItems = async (canvasId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token");
      const result = await canvasService.canvasItems(canvasId, token);
      console.log("Canvas fetched:", result);
      return result.canvas;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch canvas";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCanvas,
    getAllCanvas,
    canvasItems,
    deleteCanvasById,
    loading,
    error,
  };
};

//   const getAllFolders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("No authentication token available");
//       }

//       const response = await folderService.getFolders(token);
//       return response.folders;
//     } catch (error) {
//       console.error("Get folders error:", error);
//       throw new Error("Failed to fetch folders");
//     } finally {
//       setLoading(false);
//     }
//   };

//get folder by id
//   const getFolderById = async (folderId: string, token: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("No authentication token available");
//       }
//       const response = await folderService.getFolderById(folderId, token);
//       return response.folder;
//     } catch (error) {
//       console.error("Get folder by ID error:", error);
//       throw new Error("Failed to fetch folder details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteFolderById = async (folderId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("No authentication token available");
//       }
//       const response = await folderService.deleteFolder(folderId, token);
//       return response.folder;
//     } catch (error) {
//       console.error("Delete folder by ID error:", error);
//       throw new Error("Failed to delete folder");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateFolder = async (folderId: string, data: any) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("No authentication token available");
//       }
//       const response = await folderService.updateFolder(folderId, data, token);
//       return response.folder;
//     } catch (error) {
//       console.error("Update folder by ID error:", error);
//       throw new Error("Failed to update folder");
//     } finally {
//       setLoading(false);
//     }
//   };
