import { useState, useEffect, useCallback } from 'react';
import type { NewsCategory, UserPreferences } from '@/types';

const STORAGE_KEY = 'news_user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  interests: ['general', 'technology', 'science'],
  darkMode: false,
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      console.error('Error loading preferences');
    }
    return DEFAULT_PREFERENCES;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      console.error('Error saving preferences');
    }
  }, [preferences]);

  const setInterests = useCallback((interests: NewsCategory[]) => {
    setPreferences(prev => ({ ...prev, interests }));
  }, []);

  const toggleInterest = useCallback((category: NewsCategory) => {
    setPreferences(prev => {
      const current = prev.interests;
      if (current.includes(category)) {
        return { ...prev, interests: current.filter(c => c !== category) };
      }
      return { ...prev, interests: [...current, category] };
    });
  }, []);

  const hasInterest = useCallback((category: NewsCategory) => {
    return preferences.interests.includes(category);
  }, [preferences.interests]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    interests: preferences.interests,
    setInterests,
    toggleInterest,
    hasInterest,
    resetPreferences,
  };
}
