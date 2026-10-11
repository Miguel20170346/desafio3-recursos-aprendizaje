# Sistema de Gestión de Recursos de Aprendizaje 📚
### Universidad Don Bosco — Facultad de Ingeniería
**Materia:** Diseño y Programación de Software Multiplataforma (DPS441)  
**Tercer Desafío Práctico [15%]**

---

## 📹 Video de Defensa del Desafío
> **Enlace del Video de Defensa:**  
> [COLOCA_AQUÍ_EL_ENLACE_A_TU_VIDEO_DE_YOUTUBE_O_DRIVE](https://youtu.be/TU_ENLACE_AQUI)
> 
> *Nota: Según la guía, la defensa debe iniciar demostrando la funcionalidad de la app y posteriormente explicando la arquitectura y código.*

---

## 🚀 Descripción de la Aplicación
Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión de recursos educativos especializados en Ingeniería de Sistemas (Libros, Videos, Artículos y Tutoriales). La aplicación consume una **API REST dinámica** y proporciona autenticación con control de acceso basado en roles (**Estudiante** y **Docente**).

---

## 🔑 Credenciales Demo para Evaluación Rápida

La pantalla de inicio de sesión incluye botones de acceso rápido preconfigurados para facilitar la evaluación:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Docente** | `docente@udb.edu.sv` | `Docente2026@Udb` | Acceso a panel de gestión con **CRUD completo** (POST, PUT, DELETE). |
| **Estudiante** | `estudiante@udb.edu.sv` | `Estudiante2026#` | Visualización, búsqueda avanzada, favoritos y calificación de 1 a 5 estrellas. |

---

## 🛡️ Cumplimiento de Requisitos de la Rúbrica

### 1. Validación Estricta de Contraseñas (10%)
La pantalla de Registro valida en tiempo real:
* ✅ Mínimo 12 caracteres.
* ✅ Al menos una letra mayúscula.
* ✅ Al menos una letra minúscula.
* ✅ Al menos un número.
* ✅ Al menos un carácter especial (`!@#$%^&*`).

### 2. Autenticación y Control de Roles (10%)
* Registro con selección de rol (*Estudiante* o *Docente*).
* Persistencia de sesión mediante `@react-native-async-storage/async-storage`.
* Cierre de sesión seguro con diálogo de confirmación.

### 3. Visualización y Búsqueda Avanzada (10%)
* Tarjetas interactivas con título, descripción, tipo, imagen y enlace directo.
* **Búsqueda avanzada:** Búsqueda en tiempo real por **ID (#)**, **título** o **tipo de recurso**.
* **Filtros por categoría:** Chips interactivos para Todos, Libro, Video, Artículo y Tutorial.
* **Ordenamiento:** Opciones para ordenar por Título (A-Z), Título (Z-A) y Mayor Calificación.

### 4. CRUD Completo Docente (25%)
* **GET:** Obtención dinámica de la lista desde la API externa.
* **POST:** Formulario de alta con validación rigurosa de campos (título, descripción, tipo, enlace).
* **PUT:** Formulario de edición precargado con datos del recurso a modificar.
* **DELETE:** Eliminación con modal de confirmación obligatoria previa.

### 5. Interacciones del Estudiante
* **Favoritos:** Lista persistente por usuario almacenada localmente en AsyncStorage.
* **Sistema de Calificación:** Diálogo modal interactivo para calificar de 1 a 5 estrellas, recalculando el promedio dinámico en el backend.

### 6. UI/UX y Feedback Visual (15%)
* Uso de la librería de diseño **React Native Paper** y **@expo/vector-icons**.
* Indicadores de carga (*ActivityIndicator*), soporte *Pull-to-Refresh*, Snackbars para alertas y avisos toast.

---

## 🌐 Configuración de la API REST (MockAPI)

La app viene preconfigurada con un servicio desacoplado en `src/api/resourceService.js`.
* **Endpoint por defecto:** Compatible con MockAPI (`https://mockapi.io/`).
* **Configuración personalizada:** Puedes cambiar la URL base en cualquier momento desde la pantalla de **Perfil > Configuración de API Externa** ingresando tu propia URL generada en MockAPI o Railway.

### Esquema del Recurso en la API:
```json
{
  "id": "1",
  "titulo": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "descripcion": "Principios, patrones y mejores prácticas para escribir software limpio...",
  "tipo": "Libro",
  "enlace": "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
  "imagen": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600",
  "calificacion": 4.8,
  "totalVotos": 24
}
```

---

## 📦 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd desafio_3
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar con Expo:**
   ```bash
   npx expo start
   ```

4. **Probar en dispositivo o emulador:**
   * Presiona `a` en la terminal para abrir en el emulador de Android.
   * O escanea el código QR con la aplicación **Expo Go** en tu teléfono celular.

---

## 📂 Estructura del Proyecto

```text
├── App.js                     # Punto de entrada con proveedores globales
├── app.json                   # Configuración del proyecto Expo
├── package.json               # Dependencias del proyecto
└── src/
    ├── api/
    │   ├── config.js          # URL base y configuración dinámica de API
    │   └── resourceService.js # Peticiones REST (GET, POST, PUT, DELETE, Rating)
    ├── components/
    │   ├── RatingDialog.js    # Modal interactivo de calificación 1 a 5 estrellas
    │   └── ResourceCard.js    # Tarjeta reutilizable de visualización de recurso
    ├── context/
    │   ├── AuthContext.js     # Gestión de usuarios, sesiones y roles
    │   └── FavoritesContext.js# Gestión persistente de favoritos del estudiante
    ├── navigation/
    │   ├── AppNavigator.js    # Navegación condicional por roles y autenticación
    │   └── StudentTabs.js     # Navegación por pestañas para estudiantes
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js       # Pantalla de inicio de sesión con botones demo
    │   │   └── RegisterScreen.js    # Pantalla de registro con validación en vivo
    │   ├── common/
    │   │   └── ProfileScreen.js     # Información de usuario y ajuste de API
    │   ├── student/
    │   │   ├── FavoritesScreen.js   # Lista filtrada de favoritos del estudiante
    │   │   └── StudentHomeScreen.js # Catálogo con búsqueda, filtros y rating
    │   └── teacher/
    │       ├── ResourceFormScreen.js    # Formulario para crear (POST) o editar (PUT)
    │       └── TeacherDashboardScreen.js# Panel docente con CRUD y confirmación
    ├── theme/
    │   └── theme.js           # Paleta de colores e identidad gráfica
    └── utils/
        ├── mockData.js        # Recursos iniciales de Ingeniería de Sistemas
        └── validation.js      # Validador de contraseñas, emails y URLs
```
