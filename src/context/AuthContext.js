import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkPasswordRules, validateEmail } from '../utils/validation';

const AuthContext = createContext();

const USERS_STORAGE_KEY = '@app_registered_users';
const CURRENT_USER_KEY = '@app_active_session';

// Usuarios de prueba preconfigurados con contraseñas que cumplen las reglas de la rúbrica
const INITIAL_USERS = [
  {
    id: 'u-docente',
    name: 'Prof. Carlos Mendoza',
    email: 'docente@udb.edu.sv',
    password: 'Docente2026@Udb', // 15 chars, mayús, minús, número, especial
    role: 'Docente',
  },
  {
    id: 'u-estudiante',
    name: 'Ana Sofia Martínez',
    email: 'estudiante@udb.edu.sv',
    password: 'Estudiante2026#', // 16 chars, mayús, minús, número, especial
    role: 'Estudiante',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar almacenamiento de usuarios y recuperar sesión activa
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (!storedUsers) {
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
        }

        const savedSession = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (savedSession) {
          setUser(JSON.parse(savedSession));
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const found = users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
      );

      if (!found) {
        return { success: false, message: 'Correo o contraseña incorrectos.' };
      }

      setUser(found);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
      return { success: true, user: found };
    } catch (error) {
      return { success: false, message: 'Error interno al iniciar sesión.' };
    }
  };

  // Registro de usuario
  const register = async ({ name, email, password, role }) => {
    if (!name || name.trim().length < 3) {
      return { success: false, message: 'El nombre debe tener al menos 3 caracteres.' };
    }

    if (!validateEmail(email)) {
      return { success: false, message: 'Ingresa un correo electrónico válido.' };
    }

    const passwordRules = checkPasswordRules(password);
    if (!passwordRules.isValid) {
      return {
        success: false,
        message: 'La contraseña no cumple con los requisitos de seguridad obligatorios.',
      };
    }

    if (!role || (role !== 'Estudiante' && role !== 'Docente')) {
      return { success: false, message: 'Debe seleccionar un rol válido (Estudiante o Docente).' };
    }

    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const emailExists = users.some((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
      if (emailExists) {
        return { success: false, message: 'El correo electrónico ya se encuentra registrado.' };
      }

      const newUser = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };

      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      // Iniciar sesión automáticamente
      setUser(newUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: 'Ocurrió un error al registrar el usuario.' };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isDocente: user?.role === 'Docente',
        isEstudiante: user?.role === 'Estudiante',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
