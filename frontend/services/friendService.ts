import { API_URL } from "@/constants/config";
import axios, { isAxiosError } from "axios";

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
    console.error(error.response?.data);
    throw new Error(error.response?.data?.message || defaultMessage);
  } else if (error instanceof Error) {
    console.error(error.message);
    throw error;
  } else {
    console.error("Unknown error:", error);
    throw new Error(defaultMessage);
  }
};

export const friendService = {
  /**
   * Searches for a user by their friend code.
   * Calls: GET /api/friends/search?code=@...
   */
  searchUserByCode: async (code: string, token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/search?code=${encodeURIComponent(code)}`,
        createAuthHeaders(token)
      );
      return response.data.user;
    } catch (error) {
      handleError(error, "Failed to find user");
    }
  },

  /**
   * Sends a friend request to a user.
   * Calls: POST /api/friends/request
   */
  sendFriendRequest: async (friendCode: string, message: string, token: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/friends/request`,
        { friendCode, message },
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to send friend request");
    }
  },

  /**
   * Gets all pending friend requests for the current user.
   * Calls: GET /api/friends/requests/pending
   */
  getPendingRequests: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/requests/pending`,
        createAuthHeaders(token)
      );
      return response.data.requests || []; // Returns array of requests
    } catch (error) {
      handleError(error, "Failed to get pending requests");
    }
  },

  /**
   * Gets all sent friend requests from the current user.
   * Calls: GET /api/friends/requests/sent
   */
  getSentRequests: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/requests/sent`,
        createAuthHeaders(token)
      );
      return response.data.requests || []; // Returns array of requests
    } catch (error) {
      handleError(error, "Failed to get sent requests");
    }
  },

  /**
   * Accepts a pending friend request.
   * Calls: POST /api/friends/request/:id/accept
   */
  acceptRequest: async (requestId: string, token: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/friends/request/${requestId}/accept`,
        {},
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to accept request");
    }
  },

  /**
   * Rejects a pending friend request.
   * Calls: POST /api/friends/request/:id/reject
   */
  rejectRequest: async (requestId: string, token: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/friends/request/${requestId}/reject`,
        {},
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to reject request");
    }
  },

  /**
   * Cancels a sent friend request.
   * Calls: DELETE /api/friends/request/:id
   */
  cancelRequest: async (requestId: string, token: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/friends/request/${requestId}`,
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to cancel request");
    }
  },

  /**
   * Gets the current user's list of accepted friends.
   * Calls: GET /api/friends
   */
  getFriends: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends`,
        createAuthHeaders(token)
      );
      return response.data.friends || []; // Returns array of friends
    } catch (error) {
      handleError(error, "Failed to get friends");
    }
  },

  /**
   * Removes a friend.
   * Calls: DELETE /api/friends/:friendId
   */
  removeFriend: async (friendId: string, token: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/friends/${friendId}`,
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to remove friend");
    }
  },

  /**
   * Gets the current user's account details (including friendCode).
   * Calls: GET /api/users/me
   */
  getMe: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users/me`,
        createAuthHeaders(token)
      );
      return response.data.user.database; // Returns the database part of the /me response
    } catch (error) {
      handleError(error, "Failed to get user data");
    }
  },
  
  /**
   * Asks the backend to regenerate the user's friend code.
   * Calls: POST /api/friends/regenerate-code
   */
  regenerateCode: async (token: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/friends/regenerate-code`,
        {},
        createAuthHeaders(token)
      );
      return response.data; // Returns { success: true, friendCode: "..." }
    } catch (error) {
      handleError(error, "Failed to regenerate code");
    }
  }
};