import { API_URL } from "@/constants/config";
import axios, { isAxiosError } from "axios";
import { Collaborator, CollaboratorRole, Space } from "@/types/space"; // Import new types
import { friendService } from "./friendService"; // Import friend service

// Helper function to create auth headers
const createAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Helper for handling errors
const handleError = (error: unknown, defaultMessage: string) => {
  if (isAxiosError(error)) {
    console.error("Collaboration Service Error:", error.response?.data);
    throw new Error(error.response?.data?.message || defaultMessage);
  } else if (error instanceof Error) {
    console.error("Collaboration Service Error:", error.message);
    throw error;
  } else {
    console.error("Unknown Collaboration Error:", error);
    throw new Error(defaultMessage);
  }
};

// This service talks to your 'api/sharing' and 'api/friends' routes
export const collaborationService = {
  // --- Friend Search (from friendService) ---
  searchUserByCode: friendService.searchUserByCode,

  // --- Get Collaborators ---
  getCollaborators: async (
    itemType: "folder" | "file",
    itemId: string,
    token: string
  ): Promise<Collaborator[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/api/sharing/${itemType}/${itemId}/collaborators`,
        createAuthHeaders(token)
      );
      return response.data.data || [];
    } catch (error) {
      handleError(error, "Failed to get collaborators");
      return [];
    }
  },

  // --- Add Collaborator ---
  addCollaborator: async (
    itemType: "folder" | "file",
    itemId: string,
    collaborators: { userId: string, role: CollaboratorRole }[],
    token: string
  ): Promise<Collaborator> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/sharing/${itemType}/${itemId}/collaborators`,
        { collaborators }, // Send as 'collaborators' array
        createAuthHeaders(token)
      );
      return response.data.data[0]; // Return the new collaborator object
    } catch (error) {
      handleError(error, "Failed to add collaborator");
      throw error;
    }
  },

  // --- Remove Collaborator ---
  removeCollaborator: async (
    itemType: "folder" | "file",
    itemId: string,
    collaboratorId: string, // This is the ID of the *collaboration record*
    token: string
  ) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/sharing/${itemType}/${itemId}/collaborators/${collaboratorId}`,
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to remove collaborator");
    }
  },

  // --- FIX #3: ADD MISSING FUNCTIONS ---

  // --- Public Link Generation ---
  generateShareLink: async (
    itemType: "folder" | "file",
    itemId: string,
    token: string
  ): Promise<{ shareLink: string; shareToken: string }> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/sharing/${itemType}/${itemId}/generate-link`,
        {}, // No expiry for now
        createAuthHeaders(token)
      );
      return response.data.data; // { ..., shareLink: "..." }
    } catch (error) {
      handleError(error, "Failed to generate link");
      throw error;
    }
  },

  // --- Toggle Public Access ---
  togglePublicSharing: async (
    itemType: "folder" | "file",
    itemId: string,
    isPubliclyShared: boolean,
    token: string
  ): Promise<Space> => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/sharing/${itemType}/${itemId}/toggle-public`,
        { isPubliclyShared },
        createAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      handleError(error, "Failed to update sharing");
      throw error;
    }
  },

  // --- Update Public Role ---
  updatePublicRole: async (
    itemType: "folder" | "file",
    itemId: string,
    publicShareRole: CollaboratorRole,
    token: string
  ): Promise<Space> => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/sharing/${itemType}/${itemId}/public-role`,
        { publicShareRole },
        createAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      handleError(error, "Failed to update role");
      throw error;
    }
  },
  // --- END FIX ---
};