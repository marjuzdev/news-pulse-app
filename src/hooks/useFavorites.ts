import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FavoriteItem, NewsArticle } from '@/types';

const STORAGE_KEY = 'news_favorites';
const MAX_FAVORITES = 100;

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean up old favorites (older than 30 days)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return parsed.filter((f: FavoriteItem) => 
          new Date(f.addedAt).getTime() > thirtyDaysAgo
        );
      }
    } catch {
      console.error('Error loading favorites');
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      console.error('Error saving favorites');
    }
  }, [favorites]);

  const addFavorite = useCallback((article: NewsArticle) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === article.id)) {
        return prev;
      }
      
      const newFavorite: FavoriteItem = {
        id: article.id,
        title: article.title,
        description: article.description,
        imageUrl: article.imageUrl,
        url: article.url,
        source: article.source.name,
        addedAt: new Date().toISOString(),
      };

      const updated = [newFavorite, ...prev];
      // Keep only MAX_FAVORITES most recent
      return updated.slice(0, MAX_FAVORITES);
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((article: NewsArticle) => {
    if (isFavorite(article.id)) {
      removeFavorite(article.id);
    } else {
      addFavorite(article);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  return {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
  };
}
