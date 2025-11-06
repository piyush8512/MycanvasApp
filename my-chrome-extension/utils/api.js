//   // This file will hold all our API logic

//   // IMPORTANT: Use your backend server URL, not the Next.js app URL
//   const API_URL = 'http://192.168.1.33:4000'; 

//   /**
//    * Helper to create auth headers
//    */
//   const createAuthHeaders = (token) => ({
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   });

//   /**
//    * Helper to handle fetch responses
//    */
//   const handleResponse = async (response) => {
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error('API Error Response:', errorData);
//       throw new Error(errorData.message || 'API request failed');
//     }
//     return response.json();
//   };

//   export const API = {
//     /**
//      * Verifies a token is valid by fetching the user's data.
//      */
//     async verifyToken(token) {
//       const response = await fetch(`${API_URL}/api/users/me`, {
//         method: 'GET',
//         headers: createAuthHeaders(token),
//       });
//       // This will throw an error if not 'ok', which we want.
//       const data = await handleResponse(response);
//       return data.user.database; // Returns the database user object
//     },

//     /**
//      * Get all canvases (Files with no folderId)
//      */
//     async getAllCanvases(token) {
//       const response = await fetch(`${API_URL}/api/canvas`, {
//         method: 'GET',
//         headers: createAuthHeaders(token),
//       });
//       const data = await handleResponse(response);
//       return data.canvas || []; // Matches your `getAllCanvas` controller
//     },

//     /**
//      * Get all folders
//      */
//     async getAllFolders(token) {
//       const response = await fetch(`${API_URL}/api/folders`, {
//         method: 'GET',
//         headers: createAuthHeaders(token),
//       });
//       const data = await handleResponse(response);
//       // !! IMPORTANT: Make sure your backend folder controller returns { folders: [...] }
//       return data.folders || []; 
//     },
    
//     /**
//      * Get user details (like DB id)
//      * This is now an alias for verifyToken
//      */
//     async getUser(token) {
//       return this.verifyToken(token);
//     },

//     /**
//      * Add a card to a canvas
//      */
//     async addCardToCanvas(canvasId, cardData, token) {
//       // This now uses the correct POST method to the /items endpoint
//       const response = await fetch(`${API_URL}/api/canvas/${canvasId}/items`, {
//         method: 'POST',
//         headers: createAuthHeaders(token),
//         body: JSON.stringify(cardData),
//       });
//       const data = await handleResponse(response);
//       return data.item; // Matches your `createItem` controller
//     },
//   };



// This file will hold all our API logic

// IMPORTANT: Use your backend server URL, not the Next.js app URL
const API_URL = 'http://192.168.1.33:4000'; 

/**
 * Helper to create auth headers
 */
  const createAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Helper to handle fetch responses
 */
const handleResponse = async (response) => {
    if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error Response:', errorData);
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const API = {
  /**
   * Verifies a token is valid by fetching the user's data.
   */
    async verifyToken(token) {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    // This will throw an error if not 'ok', which we want.
    const data = await handleResponse(response);
    return data.user.database; // Returns the database user object
  },

  /**
   * Get all ROOT-LEVEL canvases (Files with no folderId)
   */
    async getAllCanvases(token) {
    const response = await fetch(`${API_URL}/api/canvas`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.canvas || []; // Matches your `getAllCanvas` controller
  },

  /**
   * Get all ROOT-LEVEL folders
   */
    async getAllFolders(token) {
    const response = await fetch(`${API_URL}/api/folders`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    // !! IMPORTANT: Make sure your backend folder controller returns { folders: [...] }
    return data.folders || []; 
  },
  
  /**
   * --- NEW FUNCTION ---
   * Get the contents of a specific folder
   */
  async getFolderById(folderId, token) {
    const response = await fetch(`${API_URL}/api/folders/${folderId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.folder; // Matches your `getFolderById` controller
  },
  
  /**
   * Get user details (like DB id)
   */
    async getUser(token) {
    return this.verifyToken(token);
  },

  /**
   * Add a card to a canvas
   */
    async addCardToCanvas(canvasId, cardData, token) {
    // This now uses the correct POST method to the /items endpoint
    const response = await fetch(`${API_URL}/api/canvas/${canvasId}/items`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify(cardData),
    });
    const data = await handleResponse(response);
    return data.item; // Matches your `createItem` controller
  },
};