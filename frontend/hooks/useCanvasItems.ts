// // frontend/hooks/useCanvasItems.js

// import { useState } from 'react';
// import { getColorForType, getDefaultPropertiesForType } from '@/utils/cardHelpers';
// import { getCardDefaultSize, getCardColor, extractVideoId } from '@/utils/linkDetector';

// export function useCanvasItems(initialItems = []) {
//   const [canvasItems, setCanvasItems] = useState(initialItems);
//   const [currentItemId, setCurrentItemId] = useState(null);

//   const addCard = (type) => {
//     const typeCount = canvasItems.filter((item) => item.type === type).length;
//     const newCard = {
//       id: Date.now().toString(),
//       type,
//       name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeCount + 1}`,
//       position: { x: 100, y: 100 },
//       size: { width: 200, height: type === 'note' ? 150 : 200 },
//       collaborators: ['user1'],
//       color: getColorForType(type),
//       ...getDefaultPropertiesForType(type),
//     };

//     setCanvasItems([...canvasItems, newCard]);
//     setCurrentItemId(newCard.id);
//     return newCard.id;
//   };

//   // Add card from pasted link
//   const addCardWithData = (cardData) => {
//     const { type, position, url } = cardData;
//     const typeCount = canvasItems.filter((item) => item.type === type).length;
//     const size = getCardDefaultSize(type);
//     const color = getCardColor(type);

//     const newCard = {
//       id: Date.now().toString(),
//       type,
//       name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeCount + 1}`,
//       position: position || { x: 100, y: 100 },
//       size,
//       collaborators: ['user1'],
//       color,
//       url,
//       title: cardData.title || url,
//       ...getDefaultPropertiesForType(type),
//     };

//     // Add specific properties based on type
//     if (type === 'youtube' && url) {
//       newCard.videoId = extractVideoId(url);
//     }

//     setCanvasItems([...canvasItems, newCard]);
//     setCurrentItemId(newCard.id);
//     return newCard.id;
//   };

//   const updateItem = (id, updates) => {
//     setCanvasItems((items) =>
//       items.map((item) => (item.id === id ? { ...item, ...updates } : item))
//     );
//   };

//   const deleteItem = (id) => {
//     setCanvasItems((items) => items.filter((item) => item.id !== id));
//   };

//   const handlePositionChange = (id, position) => {
//     updateItem(id, { position });
//   };

//   const handleDragStart = (id) => {
//     setCurrentItemId(id);
//   };

//   return {
//     canvasItems,
//     currentItemId,
//     addCard,
//     addCardWithData,
//     updateItem,
//     deleteItem,
//     handlePositionChange,
//     handleDragStart,
//     setCurrentItemId,
//   };
// }



// import { useState } from "react";
// import useSWR from "swr";
// import { canvasService } from "@/services/canvasService";

// // This is the new data-driven hook
// export const useCanvasItems = (canvasId: string, getToken: () => Promise<string | null>) => {
//   // SWR will fetch and cache the data
//   // The key is the API endpoint.
//   // The fetcher gets the token and calls the API service.
//   const fetcher = async (url: string) => {
//     const token = await getToken();
//     if (!token) throw new Error("Not authenticated");
//     return canvasService.getItems(url, token);
//   };

//   const {
//     data: canvasItems,
//     error,
//     isLoading,
//     mutate, // This function lets us re-fetch or update the local data
//   } = useSWR(
//     // Only fetch if canvasId is present
//     canvasId ? `/api/canvas/${canvasId}/items` : null, 
//     fetcher
//   );

//   const [currentItemId, setCurrentItemId] = useState(null);

//   // --- API FUNCTIONS ---

//   const addCardWithData = async (cardData: any) => {
//     const token = await getToken();
//     if (!token || !canvasId) return;

//     try {
//       // 1. Call the API to create the new item
//       const newItem = await canvasService.createItem(
//         canvasId,
//         cardData,
//         token
//       );
      
//       // 2. Update the local SWR cache to show the new item instantly
//       // (Optimistic UI)
//       mutate((currentItems = []) => [...currentItems, newItem], false);
//     } catch (error) {
//       console.error("Failed to add card:", error);
//       // TODO: Handle error (e.g., show a toast)
//     }
//   };

//   const updateItem = async (itemId: string, data: any) => {
//     const token = await getToken();
//     if (!token || !canvasId) return;

//     try {
//       // 1. Update local data first (Optimistic UI)
//       mutate((currentItems = []) => 
//         currentItems.map((item) => 
//           item.id === itemId ? { ...item, ...data } : item
//         ), 
//         false // 'false' means don't re-fetch yet
//       );
      
//       // 2. Call the API to update the database
//       await canvasService.updateItem(
//         canvasId,
//         itemId,
//         data,
//         token
//       );
//     } catch (error) {
//       console.error("Failed to update item:", error);
//       // TODO: Roll back optimistic update on error
//     }
//   };

//   const handlePositionChange = (itemId: string, newPosition: { x: number; y: number }) => {
//     // This is a frequent update, so we'll just update the DB
//     // We can "debounce" this later to avoid too many API calls
//     updateItem(itemId, { position: newPosition });
//   };
  
//   const handleDragStart = (itemId: string) => {
//     setCurrentItemId(itemId);
//   };

//   // Return everything the CanvasScreen needs
//   return {
//     canvasItems: canvasItems || [], // Default to empty array while loading
//     currentItemId,
//     error,
//     isLoading,
//     setCurrentItemId,
//     addCardWithData,
//     updateItem,
//     handlePositionChange,
//     handleDragStart,
//   };
// };


import { useState } from "react";
import useSWR from "swr";
import { canvasService } from "@/services/canvasService";
import { canvaitems } from "@/types/space"; // Import the type

// This is the new data-driven hook
export const useCanvasItems = (canvasId: string, getToken: () => Promise<string | null>) => {
  // SWR will fetch and cache the data
  // The key is the API endpoint.
  // The fetcher gets the token and calls the API service.
  const fetcher = async (url: string) => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return canvasService.getItems(url, token);
  };

  const {
    data: canvasItems,
    error,
    isLoading,
    mutate, // This function lets us re-fetch or update the local data
  } = useSWR<canvaitems[]>( // <-- Tell SWR our data is an array of CanvasItems
    // Only fetch if canvasId is present
    canvasId ? `/api/canvas/${canvasId}/items` : null, 
    fetcher
  );

  // --- FIX 1: Allow currentItemId to be a string OR null ---
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // --- API FUNCTIONS ---

  const addCardWithData = async (cardData: Partial<canvaitems>) => {
    const token = await getToken();
    if (!token || !canvasId) return;

    try {
      // 1. Call the API to create the new item
      const newItem = await canvasService.createItem(
        canvasId,
        cardData,
        token
      );
      
      // 2. Update the local SWR cache to show the new item instantly
      // (Optimistic UI)
      mutate((currentItems: canvaitems[] = []) => [...currentItems, newItem], false);
    } catch (error) {
      console.error("Failed to add card:", error);
      // TODO: Handle error (e.g., show a toast)
    }
  };

  const updateItem = async (itemId: string, data: Partial<canvaitems>) => {
    const token = await getToken();
    if (!token || !canvasId) return;

    try {
      // 1. Update local data first (Optimistic UI)
      // --- FIX 2: Smartly merge the item and its 'content' field ---
      mutate((currentItems: canvaitems[] = []) => 
        currentItems.map((item) => {
          if (item.id === itemId) {
            // This performs a deep merge on the 'content' field
            // while shallow merging the rest of the item.
            return {
              ...item,
              ...data,
              // content: {
              //   ...(item.content || {}), // Safely spread item.content
              //   ...(data.content || {}), // Safely spread data.content
              // },
            };
          }
          return item;
        }), 
        false // 'false' means don't re-fetch yet
      );
      
      // 2. Call the API to update the database
      // Note: The API also needs to be smart about merging content
      await canvasService.updateItem(
        canvasId,
        itemId,
        data,
        token
      );
    } catch (error) {
      console.error("Failed to update item:", error);
      // TODO: Roll back optimistic update on error
    }
  };

  const handlePositionChange = (itemId: string, newPosition: { x: number; y: number }) => {
    // This is a frequent update, so we'll just update the DB
    // We can "debounce" this later to avoid too many API calls
    updateItem(itemId, { position: newPosition });
  };
  
  const handleDragStart = (itemId: string) => {
    setCurrentItemId(itemId); // This is now valid (string is assignable to string | null)
  };

  // Return everything the CanvasScreen needs
  return {
    canvasItems: canvasItems || [], // Default to empty array while loading
    currentItemId,
    error,
    isLoading,
    setCurrentItemId,
    addCardWithData,
    updateItem,
    handlePositionChange,
    handleDragStart,
  };
};

