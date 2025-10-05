import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { folderService } from '@/services/folderService';

export const useFolders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const createFolder = async (name: string, isStarred: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token');

      const result = await folderService.createFolder(
        { name, isStarred },
        token
      );
      console.log('Folder created:', result);
      return result.folder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create folder';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFolder,
    loading,
    error,
  };
};