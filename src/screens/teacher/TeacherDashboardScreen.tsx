import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Searchbar,
  Button,
  Text,
  ActivityIndicator,
  Snackbar,
  Menu,
  Chip,
  FAB,
  useTheme,
  Dialog,
  Portal,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getResources, deleteResource } from '../../api/resourceService';
import ResourceCard from '../../components/ResourceCard';
import { Resource, RootStackParamList } from '../../types';

type TeacherDashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'TeacherDashboard'>;

const FILTER_TYPES = ['Todos', 'Libro', 'Video', 'Artículo', 'Tutorial'];

export default function TeacherDashboardScreen({ navigation }: TeacherDashboardScreenProps) {
  const theme = useTheme();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [sortOption, setSortOption] = useState<string>('title_asc');
  const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);

  // Diálogo de Confirmación para Eliminación (DELETE)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  const fetchResourcesData = useCallback(async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error al cargar recursos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchResourcesData();
    });
    return unsubscribe;
  }, [navigation, fetchResourcesData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResourcesData();
  };

  // 1. Agregar nuevo recurso
  const handleAddNew = () => {
    navigation.navigate('ResourceForm');
  };

  // 2. Modificar recurso existente
  const handleEdit = (resource: Resource) => {
    navigation.navigate('ResourceForm', { resource });
  };

  // 3. Confirmación antes de eliminar recurso
  const promptDelete = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteResource(resourceToDelete.id);
      setResources((prev) => prev.filter((r) => String(r.id) !== String(resourceToDelete.id)));
      setDeleteDialogVisible(false);
      setResourceToDelete(null);
      setSnackbarMessage('Recurso eliminado exitosamente de la API (DELETE).');
      setSnackbarVisible(true);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el recurso.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtrado y búsqueda avanzada
  const filteredResources = resources
    .filter((item) => {
      if (selectedType !== 'Todos' && item.tipo?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.titulo?.toLowerCase().includes(q) ||
        item.tipo?.toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortOption === 'title_asc') return (a.titulo || '').localeCompare(b.titulo || '');
      if (sortOption === 'title_desc') return (b.titulo || '').localeCompare(a.titulo || '');
      if (sortOption === 'rating_desc') return (b.calificacion || 0) - (a.calificacion || 0);
      return 0;
    });

  return (
    <View style={styles.container}>
      {/* Barra de Búsqueda y Filtros */}
      <View style={styles.topBar}>
        <Searchbar
          placeholder="Buscar por ID, título o tipo..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <Text variant="labelMedium" style={styles.countText}>
            Gestión: {filteredResources.length} recurso(s)
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
              >
                Ordenar
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

        {/* Chips de Categorías */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TYPES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipsContainer}
          renderItem={({ item }) => (
            <Chip
              selected={selectedType === item}
              onPress={() => setSelectedType(item)}
              compact
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      {/* Lista de Recursos para Docente */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando panel de gestión...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No hay recursos disponibles
              </Text>
              <Text variant="bodySmall" style={styles.emptySubtitle}>
                Presiona el botón '+' para agregar el primer recurso a la API.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              role="Docente"
              onEdit={handleEdit}
              onDelete={promptDelete}
            />
          )}
        />
      )}

      {/* Botón flotante para agregar recurso (POST) */}
      <FAB
        icon="plus"
        label="Nuevo Recurso"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFFFFF"
        onPress={handleAddNew}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => !isDeleting && setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirmar Eliminación</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              ¿Estás seguro de que deseas eliminar permanentemente el recurso:
            </Text>
            <Text variant="titleSmall" style={styles.deleteResourceTitle}>
              "{resourceToDelete?.titulo}" (ID: #{resourceToDelete?.id})
            </Text>
            <Text variant="bodySmall" style={styles.deleteWarning}>
              Esta acción ejecutará una petición DELETE a la API y no se podrá deshacer.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDeleteDialogVisible(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              textColor="#DC2626"
              onPress={handleConfirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  chipsContainer: {
    paddingVertical: 4,
  },
  chip: {
    marginRight: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
    fontSize: 50,
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
  deleteResourceTitle: {
    marginTop: 6,
    color: '#1E293B',
    fontWeight: '700',
  },
  deleteWarning: {
    marginTop: 8,
    color: '#DC2626',
  },
});
