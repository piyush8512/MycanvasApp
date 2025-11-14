import useSWR from "swr";
import { useAuth } from "@clerk/clerk-expo";
import { collaborationService } from "@/services/collaborationService";
import { CollaboratorRole, Collaborator } from "@/types/space";

// The fetcher now calls the single, generic 'getCollaborators' function
const fetcher = async (
  url: string,
  itemId: string,
  itemType: "folder" | "file", // Use "file" for canvas
  token: string | null
) => {
  if (!token) throw new Error("Not authenticated");

  if (url === "/api/collab") {
    return collaborationService.getCollaborators(itemType, itemId, token);
  }
};

export const useCollaboration = (
  itemId: string | undefined,
  itemType: "folder" | "file" | undefined,
  getToken: () => Promise<string | null>
) => {
  const {
    data: collaborators,
    error,
    isLoading,
    mutate,
  } = useSWR(
    itemId && itemType ? ["/api/collab", itemId, itemType] : null,
    async (args: [string, string, "folder" | "file"]) => {
      const token = await getToken();
      return fetcher(args[0], args[1], args[2], token);
    }
  );

  const addCollaborator = async (
    userId: string, // We send the DB User ID
    role: CollaboratorRole
  ) => {
    const token = await getToken();
    if (!token || !itemId || !itemType) return;

    const collaboratorData = [{ userId, role }];

    try {
      const newCollab = await collaborationService.addCollaborator(
        itemType,
        itemId,
        collaboratorData,
        token
      );
      mutate((current: any[] = []) => [...current, newCollab], false);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    const token = await getToken();
    if (!token || !itemId || !itemType) return;

    try {
      mutate(
        (current: any[] = []) =>
          current.filter((c: any) => c.id !== collaboratorId),
        { revalidate: false }
      );

      await collaborationService.removeCollaborator(
        itemType,
        itemId,
        collaboratorId,
        token
      );
    } catch (e) {
      console.error(e);
      mutate(); // Rollback
      throw e;
    }
  };

  // --- FIX #3: ADD MISSING FUNCTIONS ---

  const togglePublicSharing = async (isPublic: boolean) => {
    const token = await getToken();
    if (!token || !itemId || !itemType) return;
    try {
      return await collaborationService.togglePublicSharing(
        itemType,
        itemId,
        isPublic,
        token
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const generateShareLink = async () => {
    const token = await getToken();
    if (!token || !itemId || !itemType) throw new Error("Missing auth or item");
    try {
      return await collaborationService.generateShareLink(
        itemType,
        itemId,
        token
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updatePublicRole = async (role: CollaboratorRole) => {
    const token = await getToken();
    if (!token || !itemId || !itemType) return;
    try {
      return await collaborationService.updatePublicRole(
        itemType,
        itemId,
        role,
        token
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  // --- END FIX ---


  return {
    collaborators: (collaborators as Collaborator[]) || [],
    isLoading,
    error,
    addCollaborator,
    removeCollaborator,
    // --- FIX #3: EXPORT NEW FUNCTIONS ---
    togglePublicSharing,
    generateShareLink,
    updatePublicRole,
    // --- END FIX ---
  };
};