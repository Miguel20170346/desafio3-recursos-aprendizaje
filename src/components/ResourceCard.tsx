import React from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { Card, Text, Chip, IconButton, Button } from 'react-native-paper';
import { Resource, UserRole } from '../types';

interface ResourceCardProps {
  resource: Resource;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string | number) => void;
  onRate?: (resource: Resource) => void;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
  role?: UserRole;
}

export default function ResourceCard({
  resource,
  isFavorite = false,
  onToggleFavorite,
  onRate,
  onEdit,
  onDelete,
  role = 'Estudiante',
}: ResourceCardProps) {
  const handleOpenLink = async () => {
    if (!resource.enlace) {
      Alert.alert('Aviso', 'Este recurso no tiene enlace disponible.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(resource.enlace);
      if (supported) {
        await Linking.openURL(resource.enlace);
      } else {
        Alert.alert('Error', 'No es posible abrir la dirección URL indicada: ' + resource.enlace);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el enlace.');
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'libro':
        return '#2563EB';
      case 'video':
        return '#DC2626';
      case 'artículo':
      case 'articulo':
        return '#0D9488';
      case 'tutorial':
        return '#7C3AED';
      default:
        return '#475569';
    }
  };

  return (
    <Card style={styles.card} elevation={2}>
      {/* Imagen ilustrativa */}
      {resource.imagen ? (
        <Card.Cover
          source={{ uri: resource.imagen }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderCover}>
          <Text style={styles.placeholderIcon}>📖</Text>
        </View>
      )}

      <Card.Content style={styles.content}>
        {/* Cabecera de la tarjeta con tipo e ID */}
        <View style={styles.headerRow}>
          <Chip
            style={[styles.typeChip, { backgroundColor: getTypeColor(resource.tipo) + '15' }]}
            textStyle={{ color: getTypeColor(resource.tipo), fontWeight: '700', fontSize: 11 }}
            compact
          >
            {resource.tipo || 'General'}
          </Chip>
          <Text variant="labelSmall" style={styles.idText}>
            ID: #{resource.id}
          </Text>

          {/* Botón de Favorito para Estudiante */}
          {role === 'Estudiante' && onToggleFavorite && (
            <IconButton
              icon={isFavorite ? 'heart' : 'heart-outline'}
              iconColor={isFavorite ? '#E11D48' : '#94A3B8'}
              size={22}
              style={styles.favoriteBtn}
              onPress={() => onToggleFavorite(resource.id)}
            />
          )}
        </View>

        {/* Título */}
        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
          {resource.titulo}
        </Text>

        {/* Descripción corta */}
        <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
          {resource.descripcion}
        </Text>

        {/* Calificación y votos */}
        <View style={styles.ratingRow}>
          <Text style={styles.starIcon}>★</Text>
          <Text variant="labelLarge" style={styles.ratingNumber}>
            {Number(resource.calificacion || 0).toFixed(1)}
          </Text>
          <Text variant="bodySmall" style={styles.votesText}>
            ({resource.totalVotos || 0} valoraciones)
          </Text>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        {/* Abrir enlace */}
        <Button
          mode="text"
          icon="open-in-new"
          compact
          onPress={handleOpenLink}
          style={styles.actionBtn}
        >
          Ver Recurso
        </Button>

        {/* Acción de calificar para Estudiante */}
        {role === 'Estudiante' && onRate && (
          <Button
            mode="contained-tonal"
            icon="star-outline"
            compact
            onPress={() => onRate(resource)}
            style={styles.actionBtn}
          >
            Calificar
          </Button>
        )}

        {/* Acciones de gestión para Docente (CRUD) */}
        {role === 'Docente' && (
          <View style={styles.teacherActions}>
            {onEdit && (
              <IconButton
                icon="pencil"
                iconColor="#2563EB"
                size={20}
                onPress={() => onEdit(resource)}
              />
            )}
            {onDelete && (
              <IconButton
                icon="delete"
                iconColor="#DC2626"
                size={20}
                onPress={() => onDelete(resource)}
              />
            )}
          </View>
        )}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cover: {
    height: 150,
  },
  placeholderCover: {
    height: 120,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeChip: {
    marginRight: 8,
    borderRadius: 8,
  },
  idText: {
    color: '#94A3B8',
    fontWeight: '600',
    flex: 1,
  },
  favoriteBtn: {
    margin: 0,
  },
  title: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  description: {
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 18,
    marginRight: 4,
  },
  ratingNumber: {
    fontWeight: '700',
    color: '#B45309',
    marginRight: 6,
  },
  votesText: {
    color: '#64748B',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  teacherActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    borderRadius: 8,
  },
});
