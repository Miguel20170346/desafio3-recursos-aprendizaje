import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Searchbar,
  Menu,
  Button,
  Text,
  ActivityIndicator,
  Snackbar,
  useTheme,
  Chip,
} from 'react-native-paper';
import { getResources, rateResource } from '../../api/resourceService';
import { useFavorites } from '../../context/FavoritesContext';
import ResourceCard from '../../components/ResourceCard';
import RatingDialog from '../../components/RatingDialog';
import { Resource } from '../../types';

const FILTER_TYPES = ['Todos', 'Libro', 'Video', 'Artículo', 'Tutorial'];

export default function StudentHomeScreen() {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filtros y ordenamiento
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [sortOption, setSortOption] = useState<string>('title_asc'); // title_asc, title_desc, rating_desc
  const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);

  // Diálogo de calificación
  const [ratingModalVisible, setRatingModalVisible] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Snackbar de feedback visual
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  const fetchResourceData = useCallback(async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error cargando recursos:', error);
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

  // Manejo de Favoritos
  const handleToggleFavorite = (id: string | number) => {
    toggleFavorite(id);
    const currentlyFav = isFavorite(id);
    setSnackbarMessage(
      currentlyFav ? 'Recurso eliminado de favoritos' : '¡Recurso añadido a tus favoritos! ❤️'
    );
    setSnackbarVisible(true);
  };

  // Manejo de Calificación
  const handleOpenRating = (resource: Resource) => {
    setSelectedResource(resource);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async (stars: number) => {
    if (!selectedResource) return;
    try {
      const updated = await rateResource(selectedResource.id, stars);
      if (updated) {
        setResources((prev) =>
          prev.map((r) => (String(r.id) === String(selectedResource.id) ? { ...r, ...updated } : r))
        );
        setSnackbarMessage(`¡Gracias! Calificaste con ${stars} estrellas ⭐`);
        setSnackbarVisible(true);
      }
    } catch {
      setSnackbarMessage('Error al enviar la calificación.');
      setSnackbarVisible(true);
    }
  };

  // Filtrado y Búsqueda Avanzada (por ID, título o tipo)
  const filteredAndSortedResources = resources
    .filter((item) => {
      // Filtro por tipo
      if (selectedType !== 'Todos' && item.tipo?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Búsqueda avanzada por ID, título o tipo
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = item.titulo?.toLowerCase().includes(q);
      const matchesType = item.tipo?.toLowerCase().includes(q);
      const matchesId = String(item.id).toLowerCase().includes(q);

      return matchesTitle || matchesType || matchesId;
    })
    .sort((a, b) => {
      if (sortOption === 'title_asc') {
        return (a.titulo || '').localeCompare(b.titulo || '');
      } else if (sortOption === 'title_desc') {
        return (b.titulo || '').localeCompare(a.titulo || '');
      } else if (sortOption === 'rating_desc') {
        return (b.calificacion || 0) - (a.calificacion || 0);
      }
      return 0;
    });

  const getSortLabel = () => {
    switch (sortOption) {
      case 'title_asc':
        return 'Título (A - Z)';
      case 'title_desc':
        return 'Título (Z - A)';
      case 'rating_desc':
        return 'Mejor Calificados';
      default:
        return 'Ordenar';
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de Búsqueda Avanzada */}
      <View style={styles.topBar}>
        <Searchbar
          placeholder="Buscar por ID, título o tipo..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />

        {/* Menú de ordenamiento */}
        <View style={styles.filterRow}>
          <Text variant="labelMedium" style={styles.countText}>
            {filteredAndSortedResources.length} recurso(s) encontrado(s)
          </Text>

          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                icon="sort"
                onPress={() => setSortMenuVisible(true)}
                style={styles.sortButton}
              >
                {getSortLabel()}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortOption('title_asc');
                setSortMenuVisible(false);
              }}
              title="Título (A - Z)"
            />
            <Menu.Item
              onPress={() => {
                setSortOption('title_desc');
                setSortMenuVisible(false);
              }}
              title="Título (Z - A)"
            />
            <Menu.Item
              onPress={() => {
                setSortOption('rating_desc');
                setSortMenuVisible(false);
              }}
              title="Mayor Calificación ★"
            />
          </Menu>
        </View>

        {/* Filtros rápidos por tipo */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TYPES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.typeChipsList}
          renderItem={({ item }) => (
            <Chip
              selected={selectedType === item}
              onPress={() => setSelectedType(item)}
              style={styles.chip}
              compact
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {/* Lista de Recursos */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando recursos educativos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedResources}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No se encontraron recursos
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtitle}>
                Prueba buscando por otro término o cambiando los filtros.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              role="Estudiante"
              isFavorite={isFavorite(item.id)}
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

      {/* Feedback visual con Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={styles.snackbar}
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
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchbar: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    elevation: 0,
    height: 46,
  },
  searchInput: {
    minHeight: 0,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  countText: {
    color: '#64748B',
    fontWeight: '500',
  },
  sortButton: {
    borderRadius: 8,
  },
  typeChipsList: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    marginRight: 6,
  },
  listContent: {
    padding: 16,
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
  },
  emptyIcon: {
    fontSize: 48,
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
    marginTop: 4,
  },
  snackbar: {
    backgroundColor: '#1E293B',
  },
});
