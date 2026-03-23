# 📱 Portafolio Web - Plataforma de Gestión de Programadores

> Una aplicación web moderna para gestionar portafolios de programadores, asesorías técnicas y proyectos, construida con Angular 21 y Firebase.

[![Angular](https://img.shields.io/badge/Angular-21.0.0-red?logo=angular)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Roles de Usuario](#-roles-de-usuario)
- [Componentes Principales](#-componentes-principales)
- [Servicios](#-servicios)
- [Características Técnicas](#-características-técnicas)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribución](#-contribución)

---

## ✨ Características

### 🎨 Portafolios Personalizados
- **Portafolios individuales** para cada programador
- **Componentes modulares** reutilizables (Hero, Proyectos, Habilidades, Contacto)
- **Diseño responsive** con Tailwind CSS
- **Animaciones suaves** y efectos hover
- **Integración con redes sociales** (GitHub, LinkedIn, WhatsApp)

### 👥 Sistema de Usuarios
- **Autenticación completa** con Firebase Auth
- **3 roles diferenciados**: Admin, Programador, Usuario
- **Perfiles personalizables** con foto, nombre y contraseña
- **Gestión de sesiones** persistente

### 📅 Sistema de Asesorías
- **Solicitud de asesorías** por usuarios
- **Gestión de solicitudes** por programadores
- **Estados**: Pendiente, Aprobada, Rechazada, Cancelada
- **Notificaciones en tiempo real** vía EmailJS
- **Historial completo** de asesorías

### 📊 Panel de Administración
- **Dashboard centralizado** con estadísticas
- **Gestión de usuarios** (crear, editar, eliminar)
- **Gestión de horarios** de disponibilidad
- **Vista general de asesorías** y proyectos

### 🔔 Sistema de Notificaciones
- **Notificaciones en tiempo real** en la aplicación
- **Notificaciones por email** con EmailJS
- **Tipos**: Nuevas asesorías, respuestas, cancelaciones
- **Badge de contador** de notificaciones no leídas

### 💼 Gestión de Proyectos
- **CRUD completo** de proyectos
- **Validación de URLs** (repositorio, demo, imagen)
- **Categorización** por tipo (Académico, Profesional)
- **Tipo de participación** (Individual, Grupal)
- **Tecnologías utilizadas** con badges visuales

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      APLICACIÓN ANGULAR                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Usuario   │  │  Programador │  │    Admin     │       │
│  │   Dashboard │  │   Dashboard  │  │   Dashboard  │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │           Componentes Compartidos                  │      │
│  │  • Navbar  • Footer  • Hero  • Projects           │      │
│  │  • Skills  • Contact  • Modales                   │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │                   Servicios Core                   │      │
│  │  • Auth  • User  • Advisory  • Project            │      │
│  │  • Notification  • Email  • Schedule              │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │                Guards & Interceptors               │      │
│  │  • AuthGuard  • RoleGuard                         │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      FIREBASE BACKEND                        │
├─────────────────────────────────────────────────────────────┤
│  • Authentication      • Firestore Database                  │
│  • Cloud Storage       • Hosting                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                        │
├─────────────────────────────────────────────────────────────┤
│  • EmailJS (Notificaciones por correo)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías

### Frontend
- **Angular 21** - Framework principal
- **TypeScript 5.9** - Lenguaje de programación
- **Tailwind CSS 4.1** - Framework de estilos
- **RxJS 7.8** - Programación reactiva

### Backend & Database
- **Firebase Authentication** - Autenticación de usuarios
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Storage** - Almacenamiento de imágenes
- **EmailJS** - Servicio de notificaciones por email

### Herramientas de Desarrollo
- **Angular CLI 21** - Herramienta de línea de comandos
- **Vitest 4.0** - Framework de testing
- **PostCSS** - Procesador de CSS
- **Prettier** - Formateador de código

---

## 📁 Estructura del Proyecto

```
portafolioweb/
├── src/
│   ├── app/
│   │   ├── core/                          # Módulo core
│   │   │   ├── guards/                    # Guards de autenticación
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   └── services/                  # Servicios core
│   │   │       ├── auth.service.ts        # Autenticación
│   │   │       ├── user.service.ts        # Gestión de usuarios
│   │   │       ├── advisory.service.ts    # Gestión de asesorías
│   │   │       ├── project.service.ts     # Gestión de proyectos
│   │   │       ├── notification.service.ts # Notificaciones
│   │   │       ├── email.service.ts       # Envío de emails
│   │   │       └── schedule.service.ts    # Gestión de horarios
│   │   │
│   │   ├── pages/                         # Páginas de la aplicación
│   │   │   ├── home/                      # Página de inicio
│   │   │   │   └── portfolio/             # Portafolio principal
│   │   │   ├── developer/                 # Portafolios de desarrolladores
│   │   │   │   ├── alexander/             # Portafolio de Alexander
│   │   │   │   └── juan/                  # Portafolio de Juan
│   │   │   ├── admin/                     # Dashboard de administrador
│   │   │   ├── programmer/                # Dashboard de programador
│   │   │   ├── user-profile/              # Perfil de usuario
│   │   │   ├── login/                     # Página de login
│   │   │   └── register/                  # Página de registro
│   │   │
│   │   ├── shared/                        # Componentes compartidos
│   │   │   ├── components/
│   │   │   │   ├── navbar/                # Barra de navegación
│   │   │   │   ├── footer/                # Pie de página
│   │   │   │   └── developer/             # Componentes de portafolio
│   │   │   │       ├── hero-section/      # Sección hero
│   │   │   │       ├── projects-section/  # Sección proyectos
│   │   │   │       ├── skills-section/    # Sección habilidades
│   │   │   │       └── contact-section/   # Sección contacto
│   │   │   ├── interfaces/                # Interfaces TypeScript
│   │   │   │   ├── advisory.interface.ts
│   │   │   │   ├── notification.interface.ts
│   │   │   │   ├── project.interface.ts
│   │   │   │   ├── role.interface.ts
│   │   │   │   └── schedule.interface.ts
│   │   │   └── models/                    # Modelos de datos
│   │   │       └── user.model.ts
│   │   │
│   │   ├── app.routes.ts                  # Configuración de rutas
│   │   └── app.config.ts                  # Configuración de la app
│   │
│   ├── assets/                            # Recursos estáticos
│   │   └── imagenes/                      # Imágenes
│   ├── environments/                      # Variables de entorno
│   └── index.html                         # HTML principal
│
├── package.json                           # Dependencias
├── tsconfig.json                          # Configuración TypeScript
├── tailwind.config.js                     # Configuración Tailwind
└── README.md                              # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm 10.9.2 o superior
- Angular CLI 21

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd portafolioweb
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication (Email/Password)
   - Crear una base de datos Firestore
   - Habilitar Storage

4. **Configurar EmailJS**
   - Crear una cuenta en [EmailJS](https://www.emailjs.com/)
   - Crear plantillas de email
   - Obtener las credenciales (Service ID, Template IDs, Public Key)

5. **Configurar variables de entorno**

Crear archivo `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  },
  emailjs: {
    serviceId: 'service_0eplwcm',
    publicKey: 'kktEDGVaLELfRoLHg',
    templates: {
      newAdvisory: 'template_l9bes1c',
      advisoryResponse: 'template_xoqq0bc'
    }
  }
};
```

6. **Iniciar el servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

---

## ⚙️ Configuración

### Firebase Rules

**Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Asesorías
    match /advisories/{advisoryId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                       (request.auth.uid == resource.data.userId ||
                        request.auth.uid == resource.data.programmerId);
    }

    // Proyectos
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      (request.auth.uid == resource.data.developerId ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Horarios
    match /schedules/{scheduleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Notificaciones
    match /notifications/{notificationId} {
      allow read: if request.auth != null &&
                     request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 💻 Uso

### Registro e Inicio de Sesión

1. **Registrarse**: Navegar a `/register` y crear una cuenta
2. **Iniciar sesión**: Usar email y contraseña en `/login`
3. **Roles**: Los roles son asignados por un administrador

### Para Usuarios

1. **Ver portafolios**: Explorar portafolios de programadores
2. **Solicitar asesoría**: Completar formulario de solicitud
3. **Gestionar perfil**: Actualizar información personal en `/profile`

### Para Programadores

1. **Dashboard**: Acceder a `/programmer`
2. **Gestionar asesorías**: Aprobar/rechazar solicitudes
3. **Añadir proyectos**: Crear y gestionar portafolio de proyectos
4. **Ver notificaciones**: Recibir alertas de nuevas solicitudes

### Para Administradores

1. **Dashboard**: Acceder a `/admin`
2. **Gestionar usuarios**: CRUD completo de usuarios
3. **Gestionar horarios**: Configurar disponibilidad
4. **Ver estadísticas**: Dashboard con métricas del sistema

---

## 👤 Roles de Usuario

### 🔵 Usuario (USER)
- Ver portafolios de programadores
- Solicitar asesorías técnicas
- Gestionar su perfil personal
- Recibir notificaciones de respuestas

### 🟢 Programador (PROGRAMMER)
- Todas las funciones de usuario
- Dashboard de programador
- Gestionar solicitudes de asesoría (aprobar/rechazar)
- CRUD de proyectos personales
- Ver estadísticas de asesorías

### 🔴 Administrador (ADMIN)
- Todas las funciones anteriores
- Dashboard de administración
- CRUD completo de usuarios
- Gestión de horarios del sistema
- Asignación de roles
- Vista general del sistema

---

## 🧩 Componentes Principales

### Componentes Reutilizables

#### HeroSectionComponent
Sección principal del portafolio con información del desarrollador.
```typescript
@Input() developer: DeveloperInfo;
@Output() contactClick: EventEmitter<void>;
```

#### ProjectsSectionComponent
Grid de proyectos con tecnologías y enlaces.
```typescript
@Input() projects: ProjectInfo[];
```

#### SkillsSectionComponent
Barras de progreso animadas para habilidades técnicas.
```typescript
@Input() skills: SkillInfo[];
```

#### ContactSectionComponent
Formulario de contacto y enlaces sociales.
```typescript
@Input() developer: ContactInfo;
```

#### NavbarComponent
Barra de navegación con menú de usuario y notificaciones.
```typescript
@Input() currentUser: any;
@Input() customNavLinks: NavLink[];
@Output() logoutEvent: EventEmitter<void>;
@Output() scrollToEvent: EventEmitter<string>;
```

---

## 🔧 Servicios

### AuthService
Gestión de autenticación con Firebase.
```typescript
// Métodos principales
login(email: string, password: string): Promise<UserCredential>
register(email: string, password: string): Promise<UserCredential>
logout(): Promise<void>
getCurrentUser(): User | null
user$: Observable<User | null>
```

### UserService
Gestión de usuarios en Firestore.
```typescript
// Métodos principales
createUser(user: User): Promise<void>
getUserByUid(uid: string): Promise<User>
updateUserProfile(uid: string, data: Partial<User>): Promise<void>
getAllUsers(): Observable<User[]>
deleteUser(uid: string): Promise<void>
```

### AdvisoryService
Gestión de asesorías técnicas.
```typescript
// Métodos principales
createAdvisory(advisory: Advisory): Promise<string>
getAdvisoryById(id: string): Promise<Advisory>
getUserAdvisories(userId: string): Observable<Advisory[]>
getProgrammerAdvisories(programmerId: string): Observable<Advisory[]>
updateAdvisoryStatus(id: string, status: AdvisoryStatus): Promise<void>
```

### ProjectService
Gestión de proyectos de desarrolladores.
```typescript
// Métodos principales
createProject(project: Project): Promise<string>
getProjectsByDeveloper(developerId: string): Observable<Project[]>
updateProject(id: string, project: Partial<Project>): Promise<void>
deleteProject(id: string): Promise<void>
```

### NotificationService
Sistema de notificaciones en tiempo real.
```typescript
// Métodos principales
createNotification(notification: Notification): Promise<void>
getUserNotifications(userId: string): Observable<Notification[]>
markAsRead(notificationId: string): Promise<void>
markAllAsRead(userId: string): Promise<void>
```

### EmailService
Integración con EmailJS para notificaciones por correo.
```typescript
// Métodos principales
sendNewAdvisoryEmail(params: EmailParams): Promise<void>
sendAdvisoryResponseEmail(params: EmailParams): Promise<void>
```

---

## 🎯 Características Técnicas

### Arquitectura Modular
- **Componentes standalone** de Angular 21
- **Lazy loading** de módulos
- **Shared components** reutilizables
- **Separation of concerns** clara

### Seguridad
- **Guards de autenticación** en todas las rutas protegidas
- **Role-based access control** (RBAC)
- **Firebase Security Rules** en Firestore y Storage
- **Validación de formularios** con Angular Forms

### Performance
- **OnPush change detection** en componentes
- **Lazy loading** de imágenes
- **Tree shaking** automático
- **AOT compilation** en producción

### UX/UI
- **Diseño responsive** mobile-first
- **Animaciones suaves** con Tailwind
- **Loading states** en operaciones asíncronas
- **Error handling** con mensajes claros
- **Notificaciones toast** para feedback inmediato

### Testing
- **Vitest** como framework de testing
- **Unit tests** para servicios
- **Component tests** para UI

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia servidor de desarrollo en localhost:4200
npm run watch               # Build con watch mode

# Build
npm run build               # Build de producción en /dist

# Testing
npm test                    # Ejecuta tests con Vitest

# Linting
npm run lint                # Ejecuta linter (si está configurado)
```

---

## 🌟 Funcionalidades Destacadas

### Sistema de Notificaciones Dual
- **Notificaciones en app**: Badge con contador, dropdown con lista
- **Notificaciones por email**: Integración con EmailJS
- **Tiempo real**: Actualización automática con Firestore

### Gestión de Proyectos
- **Validación de URLs**: Regex para repositorio, demo e imagen
- **Campos obligatorios**: Todos los campos son requeridos
- **Vista categorizada**: Académicos vs Profesionales
- **Tipo de participación**: Individual vs Grupal

### Componentes Modulares
- **Reducción de código**: De ~186 líneas a 26 líneas por portafolio
- **Reutilización**: Mismos componentes para todos los desarrolladores
- **Mantenibilidad**: Un solo lugar para cambios
- **Consistencia**: UI uniforme en todos los portafolios

### Perfil de Usuario
- **Edición de nombre**: Actualización en tiempo real
- **Cambio de contraseña**: Con validación segura
- **Foto de perfil**: Upload a Firebase Storage
- **Información de cuenta**: Fechas de creación y actualización

---

## 🔐 Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

### Firebase
- `apiKey`: Clave API de Firebase
- `authDomain`: Dominio de autenticación
- `projectId`: ID del proyecto
- `storageBucket`: Bucket de almacenamiento
- `messagingSenderId`: ID del remitente de mensajes
- `appId`: ID de la aplicación

### EmailJS
- `serviceId`: ID del servicio EmailJS (service_0eplwcm)
- `publicKey`: Clave pública EmailJS (kktEDGVaLELfRoLHg)
- `templates.newAdvisory`: Template de nueva asesoría (template_l9bes1c)
- `templates.advisoryResponse`: Template de respuesta (template_xoqq0bc)

---

## 📊 Modelos de Datos

### User
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;  // 'admin' | 'programmer' | 'user'
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Advisory
```typescript
{
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  programmerId: string;
  programmerName: string;
  date: string;
  time: string;
  topic: string;
  description: string;
  status: AdvisoryStatus;  // 'pending' | 'approved' | 'rejected' | 'cancelled'
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Project
```typescript
{
  id?: string;
  name: string;
  description: string;
  type: ProjectType;  // 'academic' | 'professional'
  participationType: ParticipationType;  // 'individual' | 'group'
  technologies: string[];
  repositoryUrl: string;
  demoUrl: string;
  imageUrl: string;
  developerId: string;
  createdAt: Timestamp;
}
```

### Notification
```typescript
{
  id?: string;
  userId: string;
  type: NotificationType;  // 'advisory_new' | 'advisory_approved' | etc.
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}
```

---

## 🚦 Rutas de la Aplicación

```typescript
// Rutas públicas
/login                  → Página de login
/register              → Página de registro

// Rutas de portafolios (públicas)
/                      → Portfolio principal
/developer/alexander   → Portfolio de Alexander
/developer/juan        → Portfolio de Juan

// Rutas protegidas (requieren autenticación)
/profile              → Perfil de usuario

// Rutas de programador
/programmer           → Dashboard de programador

// Rutas de administrador
/admin                → Dashboard de administrador
```

---

## 🤝 Contribución

Este proyecto fue desarrollado como un sistema de gestión de portafolios y asesorías técnicas. Las contribuciones son bienvenidas siguiendo estos pasos:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📝 Changelog

### Version 2.0.0 (Actual)
- ✅ Modularización de componentes de portafolio
- ✅ Sistema de notificaciones en tiempo real
- ✅ Integración con EmailJS
- ✅ Gestión completa de proyectos con validación
- ✅ Perfil de usuario con edición de foto
- ✅ Mejoras en el sistema de roles

### Version 1.0.0
- ✅ Sistema de autenticación
- ✅ CRUD de usuarios
- ✅ Sistema de asesorías
- ✅ Dashboards diferenciados por rol
- ✅ Portafolios de desarrolladores

---

## 📄 Licencia

Este proyecto es privado y de uso educativo.

---

## 👨‍💻 Autores

- **Alexander Chuquipoma** - Desarrollador Full Stack
- **Juan Fernández** - Desarrollador Front-End & Back-End

---

## 📧 Contacto

Para consultas sobre el proyecto:
- Email: achuquipoma@est.ups.edu.ec
- GitHub: [AlexChuquipoma](https://github.com/AlexChuquipoma)
- LinkedIn: [Alexander Chuquipoma](https://www.linkedin.com/in/alexander-chuquipoma-a62686220/)

---

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- Firebase por los servicios backend
- EmailJS por el servicio de notificaciones
- Tailwind CSS por el sistema de diseño
- La comunidad de desarrolladores por su apoyo

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

Hecho con ❤️ usando Angular y Firebase

</div>
