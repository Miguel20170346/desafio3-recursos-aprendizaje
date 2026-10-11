import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import { getResources, rateResource } from '../../api/resourceService';
import { useFavorites } from '../../context/FavoritesContext';
import ResourceCard from '../../components/ResourceCard';
import RatingDialog from '../../components/RatingDialog';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Calificación
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const fetchResourceData = useCallback(async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error cargando recursos en favoritos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResourceData();
  }, [fetchResourceData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResourceData();
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    setSnackbarMessage('Recurso removido de tus favoritos.');
    setSnackbarVisible(true);
  };

  const handleOpenRating = (resource) => {
    setSelectedResource(resource);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async (stars) => {
    if (!selectedResource) return;
    try {
      const updated = await rateResource(selectedResource.id, stars);
      if (updated) {
        setResources((prev) =>
          prev.map((r) => (String(r.id) === String(selectedResource.id) ? { ...r, ...updated } : r))
        );
        setSnackbarMessage(`¡Calificación de ${stars} estrellas registrada!`);
        setSnackbarVisible(true);
      }
    } catch {
      setSnackbarMessage('Error al actualizar la calificación.');
      setSnackbarVisible(true);
    }
  };

  // Filtrar solo los recursos favoritos del estudiante
  const favoriteResources = resources.filter((item) =>
    favoriteIds.includes(String(item.id))
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando tus favoritos...</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteResources}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListHeaderComponent={
            favoriteResources.length > 0 ? (
              <Text variant="titleSmall" style={styles.headerTitle}>
                Tienes {favoriteResources.length} recurso(s) guardado(s)
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>❤️</Text>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No tienes recursos en favoritos
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtitle}>
                Explora los recursos de aprendizaje y presiona el icono de corazón para guardarlos aquí.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              role="Estudiante"
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleOpenRating}
            />
          )}
        />
      )}

      {/* Diálogo de Calificación */}
      <RatingDialog
        visible={ratingModalVisible}
        onDismiss={() => setRatingModalVisible(false)}
        onSubmit={handleSubmitRating}
        resourceTitle={selectedResource?.titulo}
        currentRating={selectedResource?.calificacion}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
  },
  headerTitle: {
    color: '#64748B',
    marginBottom: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
