import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { createResource, updateResource } from '../../api/resourceService';
import { validateUrl } from '../../utils/validation';

const TYPE_OPTIONS = [
  { value: 'Libro', label: 'Libro' },
  { value: 'Video', label: 'Video' },
  { value: 'Artículo', label: 'Artículo' },
  { value: 'Tutorial', label: 'Tutorial' },
];

export default function ResourceFormScreen({ route, navigation }) {
  const theme = useTheme();
  const existingResource = route.params?.resource;
  const isEditing = Boolean(existingResource);

  // Formulario prellenado si es edición
  const [titulo, setTitulo] = useState(existingResource?.titulo || '');
  const [descripcion, setDescripcion] = useState(existingResource?.descripcion || '');
  const [tipo, setTipo] = useState(existingResource?.tipo || 'Libro');
  const [enlace, setEnlace] = useState(existingResource?.enlace || '');
  const [imagen, setImagen] = useState(existingResource?.imagen || '');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validación rigurosa de campos del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'El título del recurso es obligatorio.';
    } else if (titulo.trim().length < 4) {
      newErrors.titulo = 'El título debe tener al menos 4 caracteres.';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }

    if (!enlace.trim()) {
      newErrors.enlace = 'El enlace o URL del recurso es obligatorio.';
    } else if (!validateUrl(enlace)) {
      newErrors.enlace = 'El enlace debe ser una URL válida (http:// o https://).';
    }

    if (imagen.trim() && !validateUrl(imagen)) {
      newErrors.imagen = 'La URL de la imagen debe ser válida (http:// o https://).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        tipo,
        enlace: enlace.trim(),
        imagen:
          imagen.trim() ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      };

      if (isEditing) {
        // OPERACIÓN PUT
        await updateResource(existingResource.id, payload);
        Alert.alert('Éxito', 'Recurso modificado correctamente (PUT).', [
          { text: 'Aceptar', onPress: () => navigation.goBack() },
        ]);
      } else {
        // OPERACIÓN POST
        await createResource(payload);
        Alert.alert('Éxito', 'Recurso educativo agregado exitosamente (POST).', [
          { text: 'Aceptar', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'No fue posible guardar el recurso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="headlineSmall" style={styles.formTitle}>
            {isEditing ? 'Modificar Recurso' : 'Nuevo Recurso Educativo'}
          </Text>
          <Text variant="bodySmall" style={styles.formSubtitle}>
            {isEditing
              ? `Editando recurso con ID: #${existingResource.id}`
              : 'Completa los datos para registrar un recurso en el catálogo'}
          </Text>

          {/* Tipo de Recurso */}
          <Text variant="labelMedium" style={styles.fieldLabel}>
            Tipo de Recurso:
          </Text>
          <SegmentedButtons
            value={tipo}
            onValueChange={setTipo}
            buttons={TYPE_OPTIONS}
            style={styles.segmented}
          />

          {/* Título */}
          <TextInput
            label="Título *"
            value={titulo}
            onChangeText={(text) => {
              setTitulo(text);
              if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: null }));
            }}
            mode="outlined"
            style={styles.input}
            error={Boolean(errors.titulo)}
          />
          {errors.titulo && <HelperText type="error">{errors.titulo}</HelperText>}

          {/* Descripción */}
          <TextInput
            label="Descripción detallada *"
            value={descripcion}
            onChangeText={(text) => {
              setDescripcion(text);
              if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: null }));
            }}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            error={Boolean(errors.descripcion)}
          />
          {errors.descripcion && <HelperText type="error">{errors.descripcion}</HelperText>}

          {/* Enlace */}
          <TextInput
            label="URL / Enlace del recurso completo *"
            value={enlace}
            onChangeText={(text) => {
              setEnlace(text);
              if (errors.enlace) setErrors((prev) => ({ ...prev, enlace: null }));
            }}
            placeholder="https://ejemplo.com/material"
            mode="outlined"
            keyboardType="url"
            autoCapitalize="none"
            style={styles.input}
            error={Boolean(errors.enlace)}
          />
          {errors.enlace && <HelperText type="error">{errors.enlace}</HelperText>}

          {/* Imagen ilustrativa */}
          <TextInput
            label="URL de imagen ilustrativa (Opcional)"
            value={imagen}
            onChangeText={(text) => {
              setImagen(text);
              if (errors.imagen) setErrors((prev) => ({ ...prev, imagen: null }));
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
            mode="outlined"
            keyboardType="url"
            autoCapitalize="none"
            style={styles.input}
            error={Boolean(errors.imagen)}
          />
          {errors.imagen && <HelperText type="error">{errors.imagen}</HelperText>}

          {/* Botones de acción */}
          <Button
            mode="contained"
            icon={isEditing ? 'content-save-edit' : 'plus'}
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.submitBtn}
            contentStyle={styles.btnContent}
          >
            {isEditing ? 'Guardar Cambios (PUT)' : 'Crear Recurso (POST)'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
            disabled={loading}
          >
            Cancelar
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  formTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  formSubtitle: {
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  fieldLabel: {
    color: '#334155',
    marginBottom: 6,
    fontWeight: '600',
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    marginTop: 16,
    borderRadius: 10,
  },
  btnContent: {
    paddingVertical: 6,
  },
  cancelBtn: {
    marginTop: 10,
    borderRadius: 10,
  },
});
