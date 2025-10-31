import { API_URL } from '@/constants/config';
import axios from 'axios';

interface CreateCanvasData {
  name: string;
  isStarred?: boolean;
  folderId?: string;
  collaborators?: string[];
}

export const canvasService = {
  async createCanvas(data: CreateCanvasData, token: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/canvas`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Create Canvas response:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create folder');
      }
      console.error('Create canvas error:', error);
      throw error;
    }
  },
  async getCanvas(token: string) {
    try {
      const response = await axios.get(
        `${API_URL}/api/canvas`,
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
        throw new Error(error.response?.data?.message || 'Failed to fetch folders');
      }
      throw error;
    }
  },

  async canvasItems(token: string, canvasId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/api/canvas/${canvasId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Canvas items response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch folders');
      }
      throw error;
    }
  },


//   async getFolders(token: string) {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/folders`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('Folders response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch folders');
//       }
//       throw error;
//     }
//   },

//   //get folder by id
//   async getFolderById(folderId: string, token: string) {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/folders/${folderId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('Folder response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch folder');
//       }
//       throw error;
//     }
//   },
//   //delete folder
//   async deleteFolder(folderId: string, token: string) {
//     try {
//       const response = await axios.delete(
//         `${API_URL}/api/folders/${folderId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Folder response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to delete folder');
//       }
//       throw error;
//     }
//   },

//   // update folder
//   async updateFolder(folderId: string, data: any, token: string) {
//     try {
//       const response = await axios.put(
//         `${API_URL}/api/folders/${folderId}`,
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Folder response:', response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to update folder');
//       }
//       throw error;
//     }
//   }
};