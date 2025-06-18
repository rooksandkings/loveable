import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favorite_dogs';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((dogId: number) => {
    setFavorites(prev => {
      if (prev.includes(dogId)) {
        return prev.filter(id => id !== dogId);
      } else {
        return [...prev, dogId];
      }
    });
  }, []);

  const isFavorite = useCallback((dogId: number) => {
    return favorites.includes(dogId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
} 