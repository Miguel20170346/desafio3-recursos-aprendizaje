import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Button, useTheme } from 'react-native-paper';

export default function RatingDialog({ visible, onDismiss, onSubmit, resourceTitle, currentRating = 0 }) {
  const theme = useTheme();
  const [selectedStars, setSelectedStars] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleRate = async () => {
    setLoading(true);
    await onSubmit(selectedStars);
    setLoading(false);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleMedium" style={styles.title}>
          Calificar Recurso
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={styles.resourceName}>
          {resourceTitle}
        </Text>
        <Text variant="bodyMedium" style={styles.instructions}>
          Selecciona una puntuación de 1 a 5 estrellas:
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setSelectedStars(star)}
              style={styles.starTouch}
            >
              <Text
                style={[
                  styles.starIcon,
                  { color: star <= selectedStars ? '#F59E0B' : '#CBD5E1' },
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text variant="labelLarge" style={styles.ratingLabel}>
          {selectedStars} de 5 estrellas
        </Text>

        <View style={styles.actions}>
          <Button mode="text" onPress={onDismiss} disabled={loading}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleRate}
            loading={loading}
            disabled={loading}
            style={styles.submitBtn}
          >
            Enviar Calificación
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  resourceName: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  instructions: {
    textAlign: 'center',
    color: '#334155',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  starTouch: {
    padding: 6,
  },
  starIcon: {
    fontSize: 40,
  },
  ratingLabel: {
    textAlign: 'center',
    color: '#D97706',
    fontWeight: '700',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  submitBtn: {
    borderRadius: 8,
  },
});
