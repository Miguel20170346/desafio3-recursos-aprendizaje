import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base para la API REST. Se puede cambiar en tiempo de ejecución o desde la pantalla de perfil.
export const DEFAULT_API_URL = 'https://6709849cafc569fb2fbf01a1.mockapi.io/api/v1';
const API_URL_KEY = '@api_base_url';

export const getApiBaseUrl = async (): Promise<string> => {
  try {
    const customUrl = await AsyncStorage.getItem(API_URL_KEY);
    return customUrl || DEFAULT_API_URL;
  } catch {
    return DEFAULT_API_URL;
  }
};

export const setApiBaseUrl = async (newUrl: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(API_URL_KEY, newUrl.trim());
    return true;
  } catch {
    return false;
  }
};
