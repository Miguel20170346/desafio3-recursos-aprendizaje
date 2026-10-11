import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import FavoritesScreen from '../screens/student/FavoritesScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { StudentTabParamList } from '../types';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export default function StudentTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'Recursos') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Mi Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 1,
          shadowOpacity: 0.05,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: '#0F172A',
        },
      })}
    >
      <Tab.Screen
        name="Recursos"
        component={StudentHomeScreen}
        options={{ title: 'Recursos de Aprendizaje' }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{ title: 'Mis Favoritos' }}
      />
      <Tab.Screen
        name="Mi Perfil"
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
    </Tab.Navigator>
  );
}
