import { API_URL } from '@/constants/config';
import axios from 'axios';

interface CreateFolderData {
  name: string;
  isStarred?: boolean;
  collaborators?: string[];
}

export const folderService = {
  async createFolder(data: CreateFolderData, token: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/folders`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Create folder response:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create folder');
      }
      console.error('Create folder error:', error);
      throw error;
    }
  },

  async getFolders(token: string) {
    try {
      const response = await axios.get(
        `${API_URL}/api/folders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Folders response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch folders');
      }
      throw error;
    }
  },

  //get folder by id
  async getFolderById(folderId: string, token: string) {
    try {
      const response = await axios.get(
        `${API_URL}/api/folders/${folderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Folder response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch folder');
      }
      throw error;
    }
  },
  //delete folder
  async deleteFolder(folderId: string, token: string) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/folders/${folderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Folder response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete folder');
      }
      throw error;
    }
  },

  // update folder
  async updateFolder(folderId: string, data: any, token: string) {
    try {
      const response = await axios.put(
        `${API_URL}/api/folders/${folderId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('Folder response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update folder');
      }
      throw error;
    }
  }
};