// import { API_URL } from '@/constants/config';
// import axios from 'axios';

// interface CreateCanvasData {
//   name: string;
//   isStarred?: boolean;
//   folderId?: string;
//   collaborators?: string[];
// }

// export const canvasService = {
//   async createCanvas(data: CreateCanvasData, token: string) {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/canvas`,
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Create Canvas response:', response.data);

//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to create folder');
//       }
//       console.error('Create canvas error:', error);
//       throw error;
//     }
//   },
//   async getCanvas(token: string) {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/canvas`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('Canvas response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
//       }
//       throw error;
//     }
//   },

//   async canvasItems(token: string, canvasId: string) {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/canvas/${canvasId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Canvas items response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
//       }
//       throw error;
//     }
//   },


// //   async getFolders(token: string) {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/api/folders`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       console.log('Folders response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
// //       }
// //       throw error;
// //     }
// //   },

// //   //get folder by id
// //   async getFolderById(folderId: string, token: string) {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/api/folders/${folderId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch folder');
// //       }
// //       throw error;
// //     }
// //   },
// //   //delete folder
// //   async deleteFolder(folderId: string, token: string) {
// //     try {
// //       const response = await axios.delete(
// //         `${API_URL}/api/folders/${folderId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to delete folder');
// //       }
// //       throw error;
// //     }
// //   },

// //   // update folder
// //   async updateFolder(folderId: string, data: any, token: string) {
// //     try {
// //       const response = await axios.put(
// //         `${API_URL}/api/folders/${folderId}`,
// //         data,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to update folder');
// //       }
// //       throw error;
// //     }
// //   }
// };


// import { API_URL } from '@/constants/config';
// import axios from 'axios';

// // --- NEW: Helper function from our context file ---
// // This function creates the headers for an authenticated request
// const createAuthHeaders = (token: string) => ({
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
// });

// interface CreateCanvasData {
//   name: string;
//   isStarred?: boolean;
//   folderId?: string;
//   collaborators?: string[];
// }

// export const canvasService = {
//   // --- Your existing createCanvas function ---
//   async createCanvas(data: CreateCanvasData, token: string) {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/canvas`,
//         data,
//         createAuthHeaders(token) // Use the new helper
//       );
//       console.log('Create Canvas response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to create folder');
//       }
//       console.error('Create canvas error:', error);
//       throw error;
//     }
//   },

//   // --- Your existing getCanvas function (fetches ALL canvases) ---
//   async getCanvas(token: string) {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/canvas`,
//         { headers: { Authorization: `Bearer ${token}` } } // Simplified
//       );
//       console.log('Canvas response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
//       }
//       throw error;
//     }
//   },

//   // --- NEW: Function to get all items for ONE canvas ---
//   // This replaces your 'canvasItems' function to be more flexible
//   getItems: async (url: string, token: string) => {
//     try {
//       // The URL is passed from SWR, e.g., /api/canvas/CANVAS_ID/items
//       const response = await axios.get(`${API_URL}/api/canvas`, createAuthHeaders(token));
//       return response.data.items; // Controller returns { success: true, items: [...] }
//     } catch (error) {
//       console.error("Failed to fetch canvas items:", error);
//       throw error;
//     }
//   },

//   // --- NEW: Function to create a new item on a canvas ---
//   createItem: async (canvasId: string, cardData: any, token: string) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/canvas`,
//         cardData,
//         createAuthHeaders(token)
//       );
//       console.log("Create Canvas response:", response.data);
//       return response.data.item; // Controller returns { success: true, item: {...} }
//     } catch (error) {
//       console.error("Failed to create canvas item:", error);
//       throw error;
//     }
//   },

//   // --- NEW: Function to update an item on a canvas ---
//   updateItem: async (
//     canvasId: string,
//     itemId: string,
//     data: any,
//     token: string
//   ) => {
//     try {
//       const response = await axios.patch(
//         `${API_URL}/api/canvas/${canvasId}/items/${itemId}`,
//         data,
//         createAuthHeaders(token)
//       );
//       return response.data.item; // Controller returns { success: true, item: {...} }
//     } catch (error) {
//       console.error("Failed to update canvas item:", error);
//       throw error;
//     }
//   },
  
// //   async getFolders(token: string) {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/api/folders`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       console.log('Folders response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
// //       }
// //       throw error;
// //     }
// //   },

// //   //get folder by id
// //   async getFolderById(folderId: string, token: string) {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/api/folders/${folderId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch folder');
// //       }
// //       throw error;
// //     }
// //   },
// //   //delete folder
// //   async deleteFolder(folderId: string, token: string) {
// //     try {
// //       const response = await axios.delete(
// //         `${API_URL}/api/folders/${folderId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to delete folder');
// //       }
// //       throw error;
// //     }
// //   },

// //   // update folder
// //   async updateFolder(folderId: string, data: any, token: string) {
// //     try {
// //       const response = await axios.put(
// //         `${API_URL}/api/folders/${folderId}`,
// //         data,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       console.log('Folder response:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       if (axios.isAxiosError(error)) {
// //         console.error('Axios error:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to update folder');
// //       }
// //       throw error;
// //     }
// //   }
// };







import { API_URL } from "@/constants/config";
import axios, { isAxiosError } from "axios"; // Import isAxiosError
import { canvaitems } from "@/types/space"; // Import your item type

// Helper function to create auth headers
const createAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Interface for creating a new canvas (File)
interface CreateCanvasData {
  name: string;
  isStarred?: boolean;
  folderId?: string;
  collaborators?: string[];
}

export const canvasService = {
  // --- Canvas (File) Functions ---

  /**
   * Creates a new canvas (which is a File)
   */
  async createCanvas(data: CreateCanvasData, token: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/canvas`,
        data,
        createAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      // --- FIX: Safely handle 'unknown' error ---
      if (isAxiosError(error)) {
        console.error("Create canvas error:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to create canvas"
        );
      } else if (error instanceof Error) {
        console.error("Create canvas error:", error.message);
        throw error;
      } else {
        console.error("Unknown error creating canvas:", error);
        throw new Error("An unknown error occurred while creating the canvas");
      }
    }
  },

    //delete folder
  async deleteCanvas(canvasId: string, token: string) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/canvas/${canvasId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Canvas response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete Canvas');
      }
      throw error;
    }
  },


  /**
   * Gets all canvases (Files) for the user that are not in a folder
   */
  async getCanvas(token: string) {
    try {
      const response = await axios.get(`${API_URL}/api/canvas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      // --- FIX: Safely handle 'unknown' error ---
      if (isAxiosError(error)) {
        console.error("Get canvas error:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to get canvases"
        );
      } else if (error instanceof Error) {
        console.error("Get canvas error:", error.message);
        throw error;
      } else {
        console.error("Unknown error getting canvases:", error);
        throw new Error("An unknown error occurred while getting canvases");
      }
    }
  },

  // --- CanvasItem Functions ---

  /**
   * Gets all items for a specific canvas
   * (Used by the SWR hook)
   */
  getItems: async (url: string, token: string): Promise<canvaitems[]> => {
    try {
      // url is passed from SWR, e.g., /api/canvas/CANVAS_ID/items
      const response = await axios.get(
        `${API_URL}${url}`, // Use the full, correct URL from SWR
        createAuthHeaders(token)
      );
      console.log("Items response:", response.data);
      return response.data.items; // Controller returns { success: true, items: [...] }
    } catch (error) {
      // --- FIX: Safely handle 'unknown' error ---
      if (isAxiosError(error)) {
        console.error("Failed to fetch canvas items:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to fetch items"
        );
      } else if (error instanceof Error) {
        console.error("Failed to fetch canvas items:", error.message);
        throw error;
      } else {
        console.error("Unknown error fetching items:", error);
        throw new Error("An unknown error occurred while fetching items");
      }
    }
  },

  /**
   * Creates a new item on a specific canvas
   */
  createItem: async (
    canvasId: string,
    cardData: Partial<canvaitems>,
    token: string
  ): Promise<canvaitems> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/canvas/${canvasId}/items`, // Use the correct RESTful URL
        cardData,
        createAuthHeaders(token)
      );
      return response.data.item; // Controller returns { success: true, item: {...} }
    } catch (error) {
      // --- FIX: Safely handle 'unknown' error ---
      if (isAxiosError(error)) {
        console.error("Failed to create canvas item:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to create item"
        );
      } else if (error instanceof Error) {
        console.error("Failed to create canvas item:", error.message);
        throw error;
      } else {
        console.error("Unknown error creating item:", error);
        throw new Error("An unknown error occurred while creating the item");
      }
    }
  },

  /**
   * Updates an existing item on a canvas
   */
  updateItem: async (
    canvasId: string,
    itemId: string,
    data: Partial<canvaitems>,
    token: string
  ): Promise<canvaitems> => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/canvas/${canvasId}/items/${itemId}`, // Use the correct RESTful URL
        data,
        createAuthHeaders(token)
      );
      return response.data.item; // Controller returns { success: true, item: {...} }
    } catch (error) {
      // --- FIX: Safely handle 'unknown' error ---
      if (isAxiosError(error)) {
        console.error("Failed to update canvas item:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to update item"
        );
      } else if (error instanceof Error) {
        console.error("Failed to update canvas item:", error.message);
        throw error;
      } else {
        console.error("Unknown error updating item:", error);
        throw new Error("An unknown error occurred while updating the item");
      }
    }
  },
};

