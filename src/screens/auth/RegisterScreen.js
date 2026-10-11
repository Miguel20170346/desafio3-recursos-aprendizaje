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
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { checkPasswordRules, validateEmail } from '../../utils/validation';

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Estudiante');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Verificación reactiva de reglas de contraseña
  const rules = checkPasswordRules(password);

  const handleRegister = async () => {
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!rules.isValid) {
      setErrorMessage('La contraseña no cumple con todos los requisitos de seguridad.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    const result = await register({
      name,
      email,
      password,
      role,
    });
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={3}>
          <Text variant="headlineSmall" style={styles.title}>
            Registro de Usuario
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Crea una cuenta para acceder a los recursos educativos
          </Text>

          {/* Selector de Rol */}
          <Text variant="labelLarge" style={styles.roleLabel}>
            Selecciona tu Rol:
          </Text>
          <SegmentedButtons
            value={role}
            onValueChange={setRole}
            buttons={[
              {
                value: 'Estudiante',
                label: 'Estudiante',
                icon: 'school',
              },
              {
                value: 'Docente',
                label: 'Docente',
                icon: 'account-tie',
              },
            ]}
            style={styles.segmented}
          />

          {/* Campos de texto */}
          <TextInput
            label="Nombre Completo"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrorMessage('');
            }}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Correo Electrónico"
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

          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrorMessage('');
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
          />

          {/* Guía visual de requisitos de contraseña según rúbrica */}
          <Surface style={styles.rulesCard} elevation={1}>
            <Text variant="labelMedium" style={styles.rulesTitle}>
              Requisitos de Seguridad (Rúbrica 10%):
            </Text>
            <View style={styles.ruleItem}>
              <Text style={{ color: rules.minLength ? '#16A34A' : '#94A3B8', fontWeight: 'bold' }}>
                {rules.minLength ? '✓ ' : '○ '}
              </Text>
              <Text style={[styles.ruleText, rules.minLength && styles.ruleMet]}>
                Mínimo 12 caracteres
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={{ color: rules.hasUpperCase ? '#16A34A' : '#94A3B8', fontWeight: 'bold' }}>
                {rules.hasUpperCase ? '✓ ' : '○ '}
              </Text>
              <Text style={[styles.ruleText, rules.hasUpperCase && styles.ruleMet]}>
                Al menos una letra mayúscula
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={{ color: rules.hasLowerCase ? '#16A34A' : '#94A3B8', fontWeight: 'bold' }}>
                {rules.hasLowerCase ? '✓ ' : '○ '}
              </Text>
              <Text style={[styles.ruleText, rules.hasLowerCase && styles.ruleMet]}>
                Al menos una letra minúscula
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={{ color: rules.hasNumber ? '#16A34A' : '#94A3B8', fontWeight: 'bold' }}>
                {rules.hasNumber ? '✓ ' : '○ '}
              </Text>
              <Text style={[styles.ruleText, rules.hasNumber && styles.ruleMet]}>
                Al menos un número
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={{ color: rules.hasSpecial ? '#16A34A' : '#94A3B8', fontWeight: 'bold' }}>
                {rules.hasSpecial ? '✓ ' : '○ '}
              </Text>
              <Text style={[styles.ruleText, rules.hasSpecial && styles.ruleMet]}>
                Al menos un carácter especial (! @#$%^&*)
              </Text>
            </View>
          </Surface>

          {errorMessage ? (
            <HelperText type="error" visible={true} style={styles.errorText}>
              {errorMessage}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerBtn}
            contentStyle={styles.btnContent}
          >
            Completar Registro
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.backBtn}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
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
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  roleLabel: {
    color: '#334155',
    marginBottom: 8,
    fontWeight: '600',
  },
  segmented: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  rulesCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  rulesTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  ruleText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
  },
  ruleMet: {
    color: '#16A34A',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 13,
    marginBottom: 8,
  },
  registerBtn: {
    marginTop: 10,
    borderRadius: 10,
  },
  btnContent: {
    paddingVertical: 6,
  },
  backBtn: {
    marginTop: 8,
  },
});
