import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type FavoriteContextType = {
  favorites: number[];
  toggleFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => Promise<void>;
  loading: boolean;
};

export const FavContext = createContext<FavoriteContextType | undefined>(undefined);

const FAVORITES_KEY = 'USER_FAVORITES';

export const FavProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on user login
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]); // clear favorites on logout
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (id: number) => favorites.includes(id);

  const clearFavorites = async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(FAVORITES_KEY);
  };

  return (
    <FavContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites, loading }}>
      {children}
    </FavContext.Provider>
  );
};
