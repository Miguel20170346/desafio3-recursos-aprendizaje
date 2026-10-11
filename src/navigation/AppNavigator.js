import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton, useTheme } from 'react-native-paper';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import StudentTabs from './StudentTabs';
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import ResourceFormScreen from '../screens/teacher/ResourceFormScreen';
import ProfileScreen from '../screens/common/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: '700',
            color: '#0F172A',
          },
          headerTintColor: theme.colors.primary,
        }}
      >
        {!user ? (
          // Pila de autenticación
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Crear Cuenta',
                headerBackTitle: 'Atrás',
              }}
            />
          </>
        ) : user.role === 'Docente' ? (
          // Pila de gestión para Docente (CRUD completo)
          <>
            <Stack.Screen
              name="TeacherDashboard"
              component={TeacherDashboardScreen}
              options={({ navigation }) => ({
                title: 'Panel Docente (CRUD)',
                headerRight: () => (
                  <IconButton
                    icon="account-circle"
                    size={26}
                    iconColor={theme.colors.primary}
                    onPress={() => navigation.navigate('TeacherProfile')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="ResourceForm"
              component={ResourceFormScreen}
              options={({ route }) => ({
                title: route.params?.resource ? 'Editar Recurso (PUT)' : 'Nuevo Recurso (POST)',
              })}
            />
            <Stack.Screen
              name="TeacherProfile"
              component={ProfileScreen}
              options={{
                title: 'Perfil del Docente',
              }}
            />
          </>
        ) : (
          // Flujo para Estudiante con pestañas inferiores
          <Stack.Screen
            name="StudentRoot"
            component={StudentTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
