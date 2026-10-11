import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, View } from 'react-native';
import {
  Text,
  Surface,
  Button,
  Chip,
  TextInput,
  Dialog,
  Portal,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { getApiBaseUrl, setApiBaseUrl, DEFAULT_API_URL } from '../../api/config';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [apiUrl, setApiUrl] = useState<string>('');
  const [logoutDialogVisible, setLogoutDialogVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadUrl = async () => {
      const url = await getApiBaseUrl();
      setApiUrl(url);
    };
    loadUrl();
  }, []);

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'La URL no puede estar vacía.');
      return;
    }
    const success = await setApiBaseUrl(apiUrl.trim());
    if (success) {
      setSnackbarMessage('URL de API actualizada con éxito.');
      setSnackbarVisible(true);
    }
  };

  const handleRestoreDefaultUrl = async () => {
    setApiUrl(DEFAULT_API_URL);
    await setApiBaseUrl(DEFAULT_API_URL);
    setSnackbarMessage('URL de API restaurada a los valores predeterminados.');
    setSnackbarVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutDialogVisible(false);
    await logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Tarjeta de Información de Usuario */}
      <Surface style={styles.card} elevation={2}>
        <View style={styles.userHeader}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: user?.role === 'Docente' ? '#DBEAFE' : '#CCFBF1' },
            ]}
          >
            <Text style={styles.avatarIcon}>
              {user?.role === 'Docente' ? '👨‍🏫' : '👨‍🎓'}
            </Text>
          </View>
          <Text variant="titleLarge" style={styles.userName}>
            {user?.name || 'Usuario'}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user?.email}
          </Text>
          <Chip
            icon={user?.role === 'Docente' ? 'account-tie' : 'school'}
            style={[
              styles.roleChip,
              {
                backgroundColor:
                  user?.role === 'Docente' ? '#1D4ED820' : '#0F766E20',
              },
            ]}
            textStyle={{
              color: user?.role === 'Docente' ? '#1D4ED8' : '#0F766E',
              fontWeight: '700',
            }}
          >
            Rol: {user?.role}
          </Chip>
        </View>
      </Surface>

      {/* Configuración de API REST (MockAPI) */}
      <Surface style={[styles.card, styles.mt]} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Configuración de API Externa (MockAPI)
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Puedes conectar la aplicación a tu propio proyecto de MockAPI o Railway configurando el endpoint aquí:
        </Text>

        <TextInput
          label="URL Base de la API REST"
          value={apiUrl}
          onChangeText={setApiUrl}
          mode="outlined"
          keyboardType="url"
          autoCapitalize="none"
          style={styles.apiInput}
        />

        <View style={styles.apiButtonsRow}>
          <Button
            mode="contained"
            compact
            onPress={handleSaveApiUrl}
            style={styles.saveBtn}
          >
            Guardar URL
          </Button>
          <Button
            mode="outlined"
            compact
            onPress={handleRestoreDefaultUrl}
            style={styles.restoreBtn}
          >
            Restaurar Default
          </Button>
        </View>
      </Surface>

      {/* Cerrar Sesión */}
      <Surface style={[styles.card, styles.mt]} elevation={2}>
        <Button
          mode="contained-tonal"
          icon="logout"
          buttonColor="#FEE2E2"
          textColor="#DC2626"
          onPress={() => setLogoutDialogVisible(true)}
          style={styles.logoutBtn}
          contentStyle={styles.btnContent}
        >
          Cerrar Sesión (Logout)
        </Button>
      </Surface>

      {/* Diálogo de Confirmación de Logout */}
      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Cerrar Sesión</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              ¿Estás seguro de que deseas salir de la aplicación?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancelar</Button>
            <Button textColor="#DC2626" onPress={handleConfirmLogout}>
              Cerrar Sesión
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  mt: {
    marginTop: 16,
  },
  userHeader: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarIcon: {
    fontSize: 36,
  },
  userName: {
    fontWeight: '700',
    color: '#0F172A',
  },
  userEmail: {
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  roleChip: {
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  apiInput: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 13,
  },
  apiButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 8,
  },
  restoreBtn: {
    flex: 1,
    borderRadius: 8,
  },
  logoutBtn: {
    borderRadius: 10,
  },
  btnContent: {
    paddingVertical: 6,
  },
});
