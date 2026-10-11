export type ResourceType = 'Libro' | 'Video' | 'Artículo' | 'Tutorial';

export interface Resource {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: ResourceType;
  enlace: string;
  imagen: string;
  calificacion?: number;
  totalVotos?: number;
}

export type UserRole = 'Docente' | 'Estudiante';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface PasswordRulesResult {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  isDocente: boolean;
  isEstudiante: boolean;
}

export interface FavoritesContextType {
  favoriteIds: string[];
  loading: boolean;
  toggleFavorite: (resourceId: string | number) => Promise<void>;
  isFavorite: (resourceId: string | number) => boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  StudentRoot: undefined;
  TeacherDashboard: undefined;
  ResourceForm: { resource?: Resource } | undefined;
  TeacherProfile: undefined;
};

export type StudentTabParamList = {
  Recursos: undefined;
  Favoritos: undefined;
  'Mi Perfil': undefined;
};
