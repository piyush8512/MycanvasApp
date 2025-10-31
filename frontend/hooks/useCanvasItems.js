// frontend/hooks/useCanvasItems.js

import { useState } from 'react';
import { getColorForType, getDefaultPropertiesForType } from '@/utils/cardHelpers';
import { getCardDefaultSize, getCardColor, extractVideoId } from '@/utils/linkDetector';

export function useCanvasItems(initialItems = []) {
  const [canvasItems, setCanvasItems] = useState(initialItems);
  const [currentItemId, setCurrentItemId] = useState(null);

  const addCard = (type) => {
    const typeCount = canvasItems.filter((item) => item.type === type).length;
    const newCard = {
      id: Date.now().toString(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeCount + 1}`,
      position: { x: 100, y: 100 },
      size: { width: 200, height: type === 'note' ? 150 : 200 },
      collaborators: ['user1'],
      color: getColorForType(type),
      ...getDefaultPropertiesForType(type),
    };

    setCanvasItems([...canvasItems, newCard]);
    setCurrentItemId(newCard.id);
    return newCard.id;
  };

  // Add card from pasted link
  const addCardWithData = (cardData) => {
    const { type, position, url } = cardData;
    const typeCount = canvasItems.filter((item) => item.type === type).length;
    const size = getCardDefaultSize(type);
    const color = getCardColor(type);

    const newCard = {
      id: Date.now().toString(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeCount + 1}`,
      position: position || { x: 100, y: 100 },
      size,
      collaborators: ['user1'],
      color,
      url,
      title: cardData.title || url,
      ...getDefaultPropertiesForType(type),
    };

    // Add specific properties based on type
    if (type === 'youtube' && url) {
      newCard.videoId = extractVideoId(url);
    }

    setCanvasItems([...canvasItems, newCard]);
    setCurrentItemId(newCard.id);
    return newCard.id;
  };

  const updateItem = (id, updates) => {
    setCanvasItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id) => {
    setCanvasItems((items) => items.filter((item) => item.id !== id));
  };

  const handlePositionChange = (id, position) => {
    updateItem(id, { position });
  };

  const handleDragStart = (id) => {
    setCurrentItemId(id);
  };

  return {
    canvasItems,
    currentItemId,
    addCard,
    addCardWithData,
    updateItem,
    deleteItem,
    handlePositionChange,
    handleDragStart,
    setCurrentItemId,
  };
}