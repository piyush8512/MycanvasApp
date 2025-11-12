import useSWR from 'swr';
import { useAuth } from '@clerk/clerk-expo';
import { friendService } from '@/services/friendService';

// This fetcher handles the /api/users/me endpoint
const fetcher = async (url: string, getToken: () => Promise<string | null>) => {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");
  
  if (url === '/api/users/me') {
    return friendService.getMe(token);
  }
};

export const useAccount = () => {
  const { getToken } = useAuth();
  
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users/me',
    (url) => fetcher(url, getToken)
  );

  const regenerateCode = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      // Call API
      const { friendCode } = await friendService.regenerateCode(token);
      
      // Update local cache
      mutate((currentUser: any) => ({ ...currentUser, friendCode }), false);
      return friendCode;
    } catch (e) {
      console.error(e);
      throw e; // Re-throw to show error in component
    }
  };

  return {
    account: data, // This is your 'database' user object
    isLoading,
    error,
    regenerateCode,
  };
};