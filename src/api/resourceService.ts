import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from './config';
import { INITIAL_RESOURCES } from '../utils/mockData';
import { Resource } from '../types';

const LOCAL_STORAGE_KEY = '@learning_resources_cache';

// Inicializar almacenamiento local si está vacío
const ensureLocalData = async (): Promise<Resource[]> => {
  const cached = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cached) {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  }
  return JSON.parse(cached);
};

// 1. OBTENER TODOS LOS RECURSOS (GET)
export const getResources = async (): Promise<Resource[]> => {
  const baseUrl = await getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/recursos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data as Resource[];
      }
    }
    return await ensureLocalData();
  } catch (error: any) {
    console.log('Fallo conexión a API remota, usando almacenamiento local persistente:', error?.message);
    return await ensureLocalData();
  }
};

// 2. CREAR UN RECURSO (POST)
export const createResource = async (resource: Omit<Resource, 'id'>): Promise<Resource> => {
  const baseUrl = await getApiBaseUrl();
  const newPayload = {
    ...resource,
    calificacion: resource.calificacion || 5.0,
    totalVotos: resource.totalVotos || 1,
  };

  try {
    const response = await fetch(`${baseUrl}/recursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPayload),
    });

    if (response.ok) {
      const created: Resource = await response.json();
      const local = await ensureLocalData();
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([created, ...local]));
      return created;
    }
  } catch (error: any) {
    console.log('Error POST en API externa, guardando en local:', error?.message);
  }

  // Fallback local
  const local = await ensureLocalData();
  const created: Resource = {
    ...newPayload,
    id: String(Date.now()),
  };
  const updatedList = [created, ...local];
  await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  return created;
};

// 3. ACTUALIZAR UN RECURSO (PUT)
export const updateResource = async (
  id: string | number,
  updatedFields: Partial<Resource>
): Promise<Resource | null> => {
  const baseUrl = await getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/recursos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    if (response.ok) {
      const updated: Resource = await response.json();
      const local = await ensureLocalData();
      const updatedList = local.map((r) => (String(r.id) === String(id) ? { ...r, ...updated } : r));
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      return updated;
    }
  } catch (error: any) {
    console.log('Error PUT en API externa, actualizando en local:', error?.message);
  }

  // Fallback local
  const local = await ensureLocalData();
  let updatedItem: Resource | null = null;
  const updatedList = local.map((r) => {
    if (String(r.id) === String(id)) {
      updatedItem = { ...r, ...updatedFields };
      return updatedItem;
    }
    return r;
  });
  await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  return updatedItem;
};

// 4. ELIMINAR UN RECURSO (DELETE)
export const deleteResource = async (id: string | number): Promise<boolean> => {
  const baseUrl = await getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/recursos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const local = await ensureLocalData();
      const filtered = local.filter((r) => String(r.id) !== String(id));
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
  } catch (error: any) {
    console.log('Error DELETE en API externa, eliminando en local:', error?.message);
  }

  // Fallback local
  const local = await ensureLocalData();
  const filtered = local.filter((r) => String(r.id) !== String(id));
  await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// 5. CALIFICAR RECURSO (Rating 1-5 estrellas y actualización en backend)
export const rateResource = async (
  id: string | number,
  ratingGiven: number
): Promise<Resource | null> => {
  const resources = await getResources();
  const resource = resources.find((r) => String(r.id) === String(id));

  if (!resource) return null;

  const currentAvg = typeof resource.calificacion === 'number' ? resource.calificacion : parseFloat(String(resource.calificacion)) || 0;
  const totalVotes = typeof resource.totalVotos === 'number' ? resource.totalVotos : parseInt(String(resource.totalVotos), 10) || 0;

  const newTotalVotes = totalVotes + 1;
  const newAvg = parseFloat(((currentAvg * totalVotes + ratingGiven) / newTotalVotes).toFixed(1));

  return await updateResource(id, {
    calificacion: newAvg,
    totalVotos: newTotalVotes,
  });
};
