import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const toggleFavorite = async (resourceId) => {
    if (!storageKey) return;

    try {
      const idStr = String(resourceId);
      let updated;
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

  const isFavorite = (resourceId) => {
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
