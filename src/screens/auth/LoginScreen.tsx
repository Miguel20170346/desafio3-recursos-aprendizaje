import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  useTheme,
  Divider,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Error al iniciar sesión');
    }
  };

  // Acceso rápido con credenciales demo preconfiguradas para facilidad de prueba
  const fillDemoDocente = () => {
    setEmail('docente@udb.edu.sv');
    setPassword('Docente2026@Udb');
    setErrorMessage('');
  };

  const fillDemoEstudiante = () => {
    setEmail('estudiante@udb.edu.sv');
    setPassword('Estudiante2026#');
    setErrorMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={3}>
          {/* Encabezado */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.iconText, { color: theme.colors.primary }]}>📚</Text>
            </View>
            <Text variant="headlineSmall" style={styles.title}>
              Recursos UDB
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sistema de Gestión de Recursos de Aprendizaje
            </Text>
            <Text variant="labelSmall" style={styles.universityBadge}>
              Ingeniería en Computación • DPS441
            </Text>
          </View>

          {/* Formulario */}
          <TextInput
            label="Correo Institucional"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage('');
            }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMessage('');
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {errorMessage ? (
            <HelperText type="error" visible={true} style={styles.errorText}>
              {errorMessage}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.registerButton}
          >
            ¿No tienes cuenta? Regístrate aquí
          </Button>

          <Divider style={styles.divider} />

          {/* Botones de acceso rápido */}
          <View style={styles.demoButtonsContainer}>
            <Button
              mode="outlined"
              icon="account-tie"
              compact
              onPress={fillDemoDocente}
              style={styles.demoBtn}
            >
              Docente Demo
            </Button>
            <Button
              mode="outlined"
              icon="school"
              compact
              onPress={fillDemoEstudiante}
              style={styles.demoBtn}
            >
              Estudiante Demo
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  universityBadge: {
    color: '#1D4ED8',
    marginTop: 6,
    fontWeight: '600',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 13,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  registerButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 18,
  },
  demoLabel: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
  },
});
