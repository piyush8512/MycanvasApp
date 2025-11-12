import useSWR from 'swr';
import { useAuth } from '@clerk/clerk-expo';
import { friendService } from '@/services/friendService';

// This fetcher handles multiple endpoints
const fetcher = async (url: string, getToken: () => Promise<string | null>) => {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  if (url === '/api/friends/requests/pending') {
    return friendService.getPendingRequests(token);
  }
  if (url === '/api/friends/requests/sent') {
    return friendService.getSentRequests(token);
  }
  return null;
};

export const useFriendRequests = (mutateFriends: () => void) => {
  const { getToken } = useAuth();

  // SWR hook for PENDING (incoming) requests
  const { 
    data: pendingRequests, 
    isLoading: isLoadingPending, 
    mutate: mutatePending 
  } = useSWR('/api/friends/requests/pending', (url) => fetcher(url, getToken));

  // SWR hook for SENT (outgoing) requests
  const { 
    data: sentRequests, 
    isLoading: isLoadingSent, 
    mutate: mutateSent 
  } = useSWR('/api/friends/requests/sent', (url) => fetcher(url, getToken));

  // Function to accept a request
  const acceptRequest = async (requestId: string) => {
    const token = await getToken();
    if (!token) return;
    try {
      await friendService.acceptRequest(requestId, token);
      mutatePending(); // Refresh pending list
      mutateFriends(); // Refresh "My Friends" list
    } catch (e) {
      console.error(e);
    }
  };

  // Function to reject a request
  const rejectRequest = async (requestId: string) => {
    const token = await getToken();
    if (!token) return;
    try {
      await friendService.rejectRequest(requestId, token);
      mutatePending(); // Refresh pending list
    } catch (e) {
      console.error(e);
    }
  };
  
  // Function to cancel a sent request
  const cancelRequest = async (requestId: string) => {
    const token = await getToken();
    if (!token) return;
    try {
      await friendService.cancelRequest(requestId, token);
      mutateSent(); // Refresh sent list
    } catch (e) {
      console.error(e);
    }
  };

  return {
    pendingRequests: pendingRequests || [],
    sentRequests: sentRequests || [],
    isLoading: isLoadingPending || isLoadingSent,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  };
};