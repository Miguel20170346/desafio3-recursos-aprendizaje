import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { FavoritesContextType } from '../types';

const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const storageKey = user ? `@favorites_user_${user.id}` : null;

  // Cargar favoritos al cambiar de usuario
  useEffect(() => {
    const loadFavorites = async () => {
      if (!storageKey) {
        setFavoriteIds([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          setFavoriteIds(JSON.parse(stored));
        } else {
          setFavoriteIds([]);
        }
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [storageKey]);

  // Alternar favorito (agregar / quitar)
  const toggleFavorite = async (resourceId: string | number) => {
    if (!storageKey) return;

    try {
      const idStr = String(resourceId);
      let updated: string[];
      if (favoriteIds.includes(idStr)) {
        updated = favoriteIds.filter((id) => id !== idStr);
      } else {
        updated = [...favoriteIds, idStr];
      }

      setFavoriteIds(updated);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error guardando favorito:', error);
    }
  };

  const isFavorite = (resourceId: string | number): boolean => {
    return favoriteIds.includes(String(resourceId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        loading,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
