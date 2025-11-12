import useSWR from 'swr';
import { useAuth } from '@clerk/clerk-expo';
import { friendService } from '@/services/friendService';

const fetcher = async (url: string, getToken: () => Promise<string | null>) => {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");
  
  if (url === '/api/friends') {
    return friendService.getFriends(token);
  }
  // Add other endpoints if needed
};

export const useFriends = () => {
  const { getToken } = useAuth();
  
  // SWR key is '/api/friends'
  const { data: friends, error, isLoading, mutate } = useSWR(
    '/api/friends',
    (url) => fetcher(url, getToken)
  );

  const removeFriend = async (friendId: string) => {
    const token = await getToken();
    if (!token) return;

    try {
      // Optimistic UI: Remove friend from list immediately
      mutate(
        (currentFriends: any) => currentFriends.filter((f: any) => f.id !== friendId),
        false // 'false' means don't re-fetch yet
      );
      // Call API
      await friendService.removeFriend(friendId, token);
    } catch (e) {
      // Rollback on error
      mutate(); 
      console.error(e);
    }
  };

  return {
    friends: friends || [],
    isLoading,
    error,
    removeFriend,
    mutateFriends: mutate, // Expose mutate for other hooks
  };
};