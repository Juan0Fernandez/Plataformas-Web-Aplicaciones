# 📬 Sistema de Notificaciones - Documentación Completa

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Interfaces y Tipos](#interfaces-y-tipos)
4. [Servicios](#servicios)
5. [Componentes](#componentes)
6. [Flujo de Notificaciones](#flujo-de-notificaciones)
7. [Reglas de Seguridad](#reglas-de-seguridad)
8. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 Visión General

El sistema de notificaciones permite a los usuarios recibir alertas en tiempo real sobre eventos importantes relacionados con las asesorías. Las notificaciones se almacenan en Firestore y se muestran en el navbar con un badge indicando las no leídas.

### Características principales:
- ✅ Notificaciones en tiempo real
- ✅ Badge con contador de notificaciones no leídas
- ✅ Diferentes tipos de notificaciones con iconos y colores personalizados
- ✅ Sistema de filtrado por usuario (cada usuario solo ve sus notificaciones)
- ✅ Marcar como leída individual o todas a la vez
- ✅ Simulación de envío por Email y WhatsApp
- ✅ Ordenamiento por fecha (más recientes primero)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO INTERACTÚA                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADVISORY SERVICE                            │
│  - createAdvisory()    → Crea notificación para programador │
│  - approveAdvisory()   → Crea notificación para usuario     │
│  - rejectAdvisory()    → Crea notificación para usuario     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               NOTIFICATION SERVICE                           │
│  - createNotification()                                      │
│  - notifyAdvisoryRequested()                                 │
│  - notifyAdvisoryApproved()                                  │
│  - notifyAdvisoryRejected()                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIRESTORE                                 │
│  Colección: notifications                                    │
│  - userId (filtro principal)                                 │
│  - type, title, message                                      │
│  - read (boolean)                                            │
│  - createdAt (ordenamiento)                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  NAVBAR COMPONENT                            │
│  - Suscripción a getUserNotifications()                      │
│  - Muestra badge con contador                                │
│  - Dropdown con lista de notificaciones                      │
│  - Botón "Marcar todas como leídas"                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Interfaces y Tipos

### 📄 Archivo: `src/app/shared/interfaces/notification.interface.ts`

#### **NotificationType (enum)**

Define los tipos de notificaciones disponibles:

```typescript
export enum NotificationType {
  ADVISORY_REQUESTED = 'advisory_requested',  // 📅 Usuario solicita asesoría
  ADVISORY_APPROVED = 'advisory_approved',    // ✅ Programador aprueba
  ADVISORY_REJECTED = 'advisory_rejected',    // ❌ Programador rechaza
  ADVISORY_COMPLETED = 'advisory_completed',  // 🎉 Asesoría completada
  SYSTEM = 'system'                           // 🔔 Notificación del sistema
}
```

#### **Notification (interface)**

Estructura de una notificación en Firestore:

```typescript
export interface Notification {
  id?: string;                      // ID del documento (generado por Firestore)
  userId: string;                   // UID del usuario que RECIBE la notificación
  type: NotificationType;           // Tipo de notificación
  title: string;                    // Título (ej: "Nueva Solicitud de Asesoría")
  message: string;                  // Mensaje descriptivo
  read: boolean;                    // Si fue leída o no
  createdAt: Date;                  // Fecha de creación

  // Campos opcionales según el contexto
  advisoryId?: string;              // ID de la asesoría relacionada
  relatedUserId?: string;           // Email del usuario relacionado
  relatedUserName?: string;         // Nombre del usuario relacionado
  relatedUserEmail?: string;        // Email del usuario relacionado

  // Información adicional para asesorías
  advisoryDate?: string;            // Fecha de la asesoría (ej: "2025-12-15")
  advisoryTime?: string;            // Hora de la asesoría (ej: "10:00")

  // Flags de envío externo
  sentByEmail?: boolean;            // Si se envió por email
  sentByWhatsApp?: boolean;         // Si se envió por WhatsApp
}
```

**Ejemplo de notificación en Firestore:**

```json
{
  "userId": "abc123xyz",
  "type": "advisory_approved",
  "title": "✅ Asesoría Aprobada",
  "message": "Alexander ha aprobado tu asesoría para el 15/12/2025 a las 10:00",
  "read": false,
  "createdAt": "2025-12-12T15:30:00Z",
  "advisoryId": "adv789",
  "relatedUserId": "alexrdfch@gmail.com",
  "relatedUserName": "Alexander Chuquipoma",
  "relatedUserEmail": "alexrdfch@gmail.com",
  "advisoryDate": "15/12/2025",
  "advisoryTime": "10:00",
  "sentByEmail": true,
  "sentByWhatsApp": true
}
```

#### **ExternalNotification (interface)**

Para el log de notificaciones enviadas por email/WhatsApp:

```typescript
export interface ExternalNotification {
  to: string;                       // Email o número de teléfono
  subject: string;                  // Asunto del mensaje
  message: string;                  // Contenido del mensaje
  type: 'email' | 'whatsapp';       // Tipo de canal
  status: 'pending' | 'sent' | 'failed';  // Estado del envío
  sentAt?: Date;                    // Fecha de envío
}
```

---

## 🛠️ Servicios

### 📄 Archivo: `src/app/core/services/notification.service.ts`

#### **Métodos Principales**

##### **1. createNotification()**

Crea una nueva notificación en Firestore.

```typescript
async createNotification(notification: Omit<Notification, 'id'>): Promise<string>
```

**Parámetros:**
- `notification`: Objeto con todos los campos de la notificación excepto `id`

**Retorna:**
- `string`: ID del documento creado en Firestore

**Ejemplo:**
```typescript
const notificationId = await notificationService.createNotification({
  userId: 'user123',
  type: NotificationType.SYSTEM,
  title: 'Bienvenido',
  message: 'Gracias por registrarte',
  read: false,
  createdAt: new Date()
});
```

**Flujo interno:**
1. Agrega el documento a la colección `notifications`
2. Convierte `createdAt` a Firestore Timestamp
3. Si es APPROVED o REJECTED, simula envío externo (email/WhatsApp)
4. Retorna el ID del documento

---

##### **2. getUserNotifications()**

Obtiene todas las notificaciones de un usuario específico.

```typescript
getUserNotifications(userId: string): Observable<Notification[]>
```

**Parámetros:**
- `userId`: UID del usuario (del campo `uid` en Firebase Auth)

**Retorna:**
- `Observable<Notification[]>`: Stream de notificaciones

**Funcionamiento:**
1. Consulta la colección `notifications`
2. **Filtra por `userId`** (cada usuario solo ve SUS notificaciones)
3. Ordena por `createdAt` descendente (más recientes primero)
4. Actualiza el contador de no leídas (`unreadCountSubject`)

**Ejemplo en componente:**
```typescript
this.notificationService
  .getUserNotifications(this.currentUser.uid)
  .subscribe(notifications => {
    this.notifications = notifications.slice(0, 5); // Solo 5 más recientes
    this.unreadCount = notifications.filter(n => !n.read).length;
  });
```

---

##### **3. markAsRead()**

Marca una notificación individual como leída.

```typescript
async markAsRead(notificationId: string): Promise<void>
```

**Parámetros:**
- `notificationId`: ID del documento en Firestore

**Ejemplo:**
```typescript
async markAsRead(notification: Notification): Promise<void> {
  if (notification.id && !notification.read) {
    await this.notificationService.markAsRead(notification.id);
  }
}
```

---

##### **4. markAllAsRead()**

Marca todas las notificaciones de un usuario como leídas.

```typescript
async markAllAsRead(userId: string): Promise<void>
```

**Parámetros:**
- `userId`: UID del usuario

**Funcionamiento:**
1. Obtiene todos los documentos de `notifications`
2. Filtra por `userId` y `read: false`
3. Actualiza todos en paralelo con `Promise.all()`
4. Resetea el contador a 0

**Ejemplo:**
```typescript
async markAllAsRead(): Promise<void> {
  if (this.currentUser?.uid) {
    await this.notificationService.markAllAsRead(this.currentUser.uid);
    this.loadNotifications();
  }
}
```

---

##### **5. notifyAdvisoryRequested()**

Crea notificación cuando un usuario solicita una asesoría.

```typescript
async notifyAdvisoryRequested(
  programmerId: string,
  programmerName: string,
  userName: string,
  userEmail: string,
  advisoryId: string,
  date: string,
  time: string
): Promise<void>
```

**Parámetros:**
- `programmerId`: UID del programador (quien RECIBE la notificación)
- `programmerName`: Nombre del programador
- `userName`: Nombre del usuario que solicita
- `userEmail`: Email del usuario que solicita
- `advisoryId`: ID de la asesoría creada
- `date`: Fecha de la asesoría (formato: "15/12/2025")
- `time`: Hora de la asesoría (formato: "10:00")

**Notificación creada:**
```typescript
{
  userId: programmerId,  // El programador recibe la notificación
  type: NotificationType.ADVISORY_REQUESTED,
  title: '📅 Nueva Solicitud de Asesoría',
  message: 'Juan Pérez (juan@email.com) ha solicitado una asesoría para el 15/12/2025 a las 10:00',
  read: false,
  createdAt: new Date(),
  advisoryId: 'adv123',
  relatedUserId: 'juan@email.com',
  relatedUserName: 'Juan Pérez',
  relatedUserEmail: 'juan@email.com',
  advisoryDate: '15/12/2025',
  advisoryTime: '10:00'
}
```

---

##### **6. notifyAdvisoryApproved()**

Crea notificación cuando un programador aprueba una asesoría.

```typescript
async notifyAdvisoryApproved(
  userId: string,
  userName: string,
  programmerName: string,
  programmerEmail: string,
  advisoryId: string,
  date: string,
  time: string,
  responseMessage?: string
): Promise<void>
```

**Parámetros:**
- `userId`: UID del usuario (quien RECIBE la notificación)
- `userName`: Nombre del usuario
- `programmerName`: Nombre del programador que aprueba
- `programmerEmail`: Email del programador
- `advisoryId`: ID de la asesoría
- `date`: Fecha de la asesoría
- `time`: Hora de la asesoría
- `responseMessage`: Mensaje opcional del programador

**Ejemplo:**
```typescript
await notificationService.notifyAdvisoryApproved(
  'user123',
  'Juan Pérez',
  'Alexander Chuquipoma',
  'alex@email.com',
  'adv789',
  '15/12/2025',
  '10:00',
  'Nos vemos en Google Meet'
);
```

**Notificación resultante:**
```
Título: ✅ Asesoría Aprobada
Mensaje: Alexander Chuquipoma ha aprobado tu asesoría para el 15/12/2025 a las 10:00. Mensaje: "Nos vemos en Google Meet"
```

---

##### **7. notifyAdvisoryRejected()**

Crea notificación cuando un programador rechaza una asesoría.

```typescript
async notifyAdvisoryRejected(
  userId: string,
  userName: string,
  programmerName: string,
  programmerEmail: string,
  advisoryId: string,
  date: string,
  time: string,
  responseMessage?: string
): Promise<void>
```

Similar a `notifyAdvisoryApproved()` pero con tipo `ADVISORY_REJECTED`.

---

##### **8. getNotificationIcon()**

Retorna el emoji según el tipo de notificación.

```typescript
getNotificationIcon(type: NotificationType): string
```

**Mapeo:**
| Tipo | Emoji |
|------|-------|
| `ADVISORY_REQUESTED` | 📅 |
| `ADVISORY_APPROVED` | ✅ |
| `ADVISORY_REJECTED` | ❌ |
| `ADVISORY_COMPLETED` | 🎉 |
| `SYSTEM` | 🔔 |
| Default | 📬 |

---

##### **9. getNotificationColor()**

Retorna las clases CSS de Tailwind para el color según el tipo.

```typescript
getNotificationColor(type: NotificationType): string
```

**Mapeo:**
| Tipo | Color (Tailwind CSS) |
|------|----------------------|
| `ADVISORY_REQUESTED` | `bg-blue-600/20 border-blue-600/50` |
| `ADVISORY_APPROVED` | `bg-green-600/20 border-green-600/50` |
| `ADVISORY_REJECTED` | `bg-red-600/20 border-red-600/50` |
| `ADVISORY_COMPLETED` | `bg-purple-600/20 border-purple-600/50` |
| `SYSTEM` | `bg-yellow-600/20 border-yellow-600/50` |
| Default | `bg-gray-600/20 border-gray-600/50` |

---

### 📄 Archivo: `src/app/core/services/advisory.service.ts`

Este servicio gestiona las asesorías y **llama automáticamente** al NotificationService.

#### **Métodos que crean notificaciones:**

##### **1. createAdvisory()**

Cuando un usuario solicita una asesoría, se crea automáticamente una notificación para el programador.

```typescript
async createAdvisory(
  userId: string,
  userName: string,
  userEmail: string,
  programmerName: string,
  request: AdvisoryRequest
): Promise<string>
```

**Flujo:**
1. Crea el documento de asesoría en Firestore
2. **Llama a** `notificationService.notifyAdvisoryRequested()`
3. El programador recibe la notificación

**Ubicación en código:** Líneas 44-52

```typescript
// Crear notificación para el programador
await this.notificationService.notifyAdvisoryRequested(
  request.programmerId,
  programmerName,
  userName,
  userEmail,
  docRef.id,
  dateString,
  request.time
);
```

---

##### **2. approveAdvisory()**

Cuando un programador aprueba, se notifica al usuario.

```typescript
async approveAdvisory(advisoryId: string, message?: string): Promise<void>
```

**Flujo:**
1. Obtiene datos de la asesoría
2. Actualiza status a `APPROVED`
3. **Llama a** `notificationService.notifyAdvisoryApproved()`
4. El usuario recibe la notificación

**Ubicación en código:** Líneas 145-154

```typescript
// Crear notificación para el usuario
await this.notificationService.notifyAdvisoryApproved(
  advisory.userId,
  advisory.userName,
  advisory.programmerName,
  advisory.programmerId,
  advisoryId,
  dateString,
  advisory.time,
  message
);
```

---

##### **3. rejectAdvisory()**

Cuando un programador rechaza, se notifica al usuario.

```typescript
async rejectAdvisory(advisoryId: string, message: string): Promise<void>
```

**Flujo:**
1. Obtiene datos de la asesoría
2. Actualiza status a `REJECTED`
3. **Llama a** `notificationService.notifyAdvisoryRejected()`
4. El usuario recibe la notificación

**Ubicación en código:** Líneas 178-187

---

## 🎨 Componentes

### 📄 Archivo: `src/app/shared/components/navbar/navbar.component.ts`

El navbar muestra las notificaciones en un dropdown con badge.

#### **Propiedades importantes:**

```typescript
notifications: Notification[] = [];          // Array de notificaciones
unreadCount = 0;                            // Contador de no leídas
notificationsMenuOpen = false;              // Estado del dropdown
private notificationSubscription?: Subscription;  // Suscripción
```

#### **Métodos principales:**

##### **1. ngOnInit() / ngOnChanges()**

Carga las notificaciones cuando el componente se inicializa o cuando cambia el usuario.

```typescript
ngOnInit(): void {
  if (this.currentUser?.uid) {
    this.loadNotifications();
  }
}

ngOnChanges(): void {
  if (this.currentUser?.uid) {
    this.loadNotifications();
  }
}
```

---

##### **2. loadNotifications()**

Suscribe al stream de notificaciones del usuario actual.

```typescript
loadNotifications(): void {
  if (!this.currentUser?.uid) return;

  this.notificationSubscription = this.notificationService
    .getUserNotifications(this.currentUser.uid)
    .subscribe(notifications => {
      this.notifications = notifications.slice(0, 5); // Solo 5 más recientes
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
}
```

**Ubicación:** Líneas 77-86

---

##### **3. toggleNotificationsMenu()**

Abre/cierra el dropdown de notificaciones.

```typescript
toggleNotificationsMenu(): void {
  this.notificationsMenuOpen = !this.notificationsMenuOpen;
  if (this.notificationsMenuOpen) {
    this.userMenuOpen = false;  // Cierra el menú de usuario
  }
}
```

---

##### **4. markAsRead()**

Marca una notificación como leída al hacer clic.

```typescript
async markAsRead(notification: Notification): Promise<void> {
  if (notification.id && !notification.read) {
    await this.notificationService.markAsRead(notification.id);
    this.loadNotifications();  // Recarga para actualizar el UI
  }
}
```

**Ubicación:** Líneas 139-144

---

##### **5. markAllAsRead()**

Marca todas las notificaciones como leídas.

```typescript
async markAllAsRead(): Promise<void> {
  if (this.currentUser?.uid) {
    await this.notificationService.markAllAsRead(this.currentUser.uid);
    this.loadNotifications();
  }
}
```

**Ubicación:** Líneas 146-151

---

##### **6. getTimeAgo()**

Calcula el tiempo transcurrido desde la creación de la notificación.

```typescript
getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return 'Justo ahora';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays}d`;

  return new Date(date).toLocaleDateString();
}
```

**Ejemplos:**
- 30 segundos → "Justo ahora"
- 5 minutos → "Hace 5 min"
- 3 horas → "Hace 3h"
- 2 días → "Hace 2d"
- 10 días → "12/12/2025"

**Ubicación:** Líneas 161-176

---

### 📄 Archivo: `src/app/shared/components/navbar/navbar.component.html`

#### **Badge de notificaciones (Desktop)**

```html
<!-- Notifications Bell -->
<div *ngIf="currentUser" class="relative notifications-menu-container">
  <button (click)="toggleNotificationsMenu()" class="relative text-gray-300 hover:text-purple-400">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
      </path>
    </svg>
    <!-- Unread Count Badge -->
    <span *ngIf="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </span>
  </button>
  <!-- ... Dropdown ... -->
</div>
```

**Ubicación:** Líneas 20-29

**Explicación:**
- `*ngIf="currentUser"` → Solo se muestra si hay usuario autenticado
- `*ngIf="unreadCount > 0"` → Badge solo aparece si hay notificaciones sin leer
- `unreadCount > 9 ? '9+' : unreadCount` → Si hay más de 9, muestra "9+"

---

#### **Dropdown de notificaciones**

```html
<!-- Notifications Dropdown -->
<div *ngIf="notificationsMenuOpen"
     class="absolute right-0 mt-2 w-96 bg-slate-800 rounded-lg shadow-xl border border-purple-500/20 z-50 max-h-[500px] overflow-hidden flex flex-col">

  <!-- Header -->
  <div class="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
    <h3 class="text-white font-semibold">Notificaciones</h3>
    <button *ngIf="unreadCount > 0"
            (click)="markAllAsRead()"
            class="text-purple-400 text-xs hover:text-purple-300 transition">
      Marcar todas como leídas
    </button>
  </div>

  <!-- Notifications List -->
  <div class="overflow-y-auto flex-1">
    <div *ngIf="notifications.length === 0" class="px-4 py-8 text-center">
      <p class="text-gray-400">No tienes notificaciones</p>
    </div>

    <div *ngFor="let notification of notifications"
         (click)="markAsRead(notification)"
         [class]="'px-4 py-3 border-b border-gray-700/50 hover:bg-slate-700/50 transition cursor-pointer ' +
                  (!notification.read ? 'bg-slate-700/30' : '')">

      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div [class]="'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl border ' +
                      getNotificationColor(notification)">
          {{ getNotificationIcon(notification) }}
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h4 class="text-white text-sm font-semibold truncate">{{ notification.title }}</h4>
            <span *ngIf="!notification.read" class="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
          </div>
          <p class="text-gray-300 text-xs line-clamp-2 mb-1">{{ notification.message }}</p>
          <span class="text-gray-500 text-xs">{{ getTimeAgo(notification.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Ubicación:** Líneas 32-73

**Explicación visual:**

```
┌────────────────────────────────────────────┐
│  Notificaciones   [Marcar todas como leídas]│ ← Header
├────────────────────────────────────────────┤
│  📅  Nueva Solicitud de Asesoría       ●   │ ← No leída (punto púrpura)
│      Juan ha solicitado asesoría...        │
│      Hace 5 min                            │
├────────────────────────────────────────────┤
│  ✅  Asesoría Aprobada                     │ ← Leída (sin punto)
│      Alexander aprobó tu asesoría...       │
│      Hace 2h                               │
├────────────────────────────────────────────┤
│  ❌  Asesoría Rechazada                    │
│      Lo siento, no puedo...                │
│      Ayer                                  │
└────────────────────────────────────────────┘
```

**Características:**
- Las notificaciones no leídas tienen fondo más oscuro (`bg-slate-700/30`)
- Al hacer clic en una notificación, se marca como leída
- Las no leídas muestran un punto púrpura (`●`) a la derecha del título
- Cada tipo tiene su propio color de borde e icono

---

## 🔄 Flujo de Notificaciones

### Flujo 1: Usuario solicita asesoría

```
┌────────────┐
│   USUARIO  │ Completa formulario de asesoría
└─────┬──────┘
      │
      ▼
┌─────────────────────┐
│ PortfolioComponent  │ Llama a advisoryService.createAdvisory()
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│  AdvisoryService    │ 1. Crea documento en Firestore
└─────┬───────────────┘    2. Llama a notificationService.notifyAdvisoryRequested()
      │
      ▼
┌─────────────────────────┐
│  NotificationService    │ Crea notificación con:
└─────┬───────────────────┘ - userId: programmerId (quien recibe)
      │                     - type: ADVISORY_REQUESTED
      │                     - title: "📅 Nueva Solicitud de Asesoría"
      ▼
┌──────────────┐
│  FIRESTORE   │ Documento creado en colección "notifications"
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ NavbarComponent │ Suscripción detecta nueva notificación
│ (Programador)   │ - Actualiza badge: unreadCount++
└─────────────────┘ - Muestra notificación en dropdown
```

**Datos almacenados:**
```json
{
  "userId": "programador123",          ← El programador recibe
  "type": "advisory_requested",
  "title": "📅 Nueva Solicitud de Asesoría",
  "message": "Juan Pérez (juan@email.com) ha solicitado una asesoría para el 15/12/2025 a las 10:00",
  "read": false,
  "createdAt": "2025-12-12T15:30:00Z",
  "advisoryId": "adv789",
  "relatedUserId": "juan@email.com",
  "relatedUserName": "Juan Pérez",
  "advisoryDate": "15/12/2025",
  "advisoryTime": "10:00"
}
```

---

### Flujo 2: Programador aprueba asesoría

```
┌──────────────┐
│ PROGRAMADOR  │ Hace clic en "Aprobar"
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ ProgrammerDashboard     │ Llama a advisoryService.approveAdvisory()
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────┐
│  AdvisoryService    │ 1. Actualiza status de asesoría a "approved"
└──────┬──────────────┘    2. Llama a notificationService.notifyAdvisoryApproved()
       │
       ▼
┌─────────────────────────┐
│  NotificationService    │ Crea notificación con:
└──────┬──────────────────┘ - userId: userId (quien recibe)
       │                     - type: ADVISORY_APPROVED
       │                     - title: "✅ Asesoría Aprobada"
       ▼
┌──────────────┐
│  FIRESTORE   │ Documento creado
└──────┬───────┘ + Log en "externalNotifications" (email/WhatsApp)
       │
       ▼
┌──────────────┐
│ NavbarComponent │ Usuario ve la notificación
│ (Usuario)       │ - Badge: unreadCount++
└─────────────────┘ - Dropdown: "✅ Asesoría Aprobada"
```

**Datos almacenados:**
```json
{
  "userId": "user123",                  ← El usuario recibe
  "type": "advisory_approved",
  "title": "✅ Asesoría Aprobada",
  "message": "Alexander ha aprobado tu asesoría para el 15/12/2025 a las 10:00. Mensaje: \"Nos vemos en Google Meet\"",
  "read": false,
  "createdAt": "2025-12-12T16:00:00Z",
  "advisoryId": "adv789",
  "relatedUserId": "alexrdfch@gmail.com",
  "relatedUserName": "Alexander Chuquipoma",
  "advisoryDate": "15/12/2025",
  "advisoryTime": "10:00",
  "sentByEmail": true,
  "sentByWhatsApp": true
}
```

**Además, se crea log en `externalNotifications`:**

```json
// Email
{
  "to": "juan@email.com",
  "subject": "✅ Asesoría Aprobada",
  "message": "Alexander ha aprobado tu asesoría...",
  "type": "email",
  "status": "sent",
  "sentAt": "2025-12-12T16:00:01Z"
}

// WhatsApp
{
  "to": "juan@email.com",  // En producción sería número de teléfono
  "subject": "✅ Asesoría Aprobada",
  "message": "Alexander ha aprobado tu asesoría...",
  "type": "whatsapp",
  "status": "sent",
  "sentAt": "2025-12-12T16:00:02Z"
}
```

---

### Flujo 3: Usuario marca notificación como leída

```
┌────────────┐
│   USUARIO  │ Hace clic en una notificación
└─────┬──────┘
      │
      ▼
┌──────────────────┐
│ NavbarComponent  │ Llama a markAsRead(notification)
└─────┬────────────┘
      │
      ▼
┌─────────────────────────┐
│  NotificationService    │ Actualiza documento en Firestore
└─────┬───────────────────┘ - Cambia "read" de false a true
      │
      ▼
┌──────────────┐
│  FIRESTORE   │ Documento actualizado
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ NavbarComponent  │ Recarga notificaciones
└──────────────────┘ - Badge: unreadCount--
                     - Notificación sin punto púrpura
                     - Fondo normal (sin resaltado)
```

---

## 🔒 Reglas de Seguridad

### 📄 Archivo: `firestore.rules`

```javascript
// NOTIFICACIONES
match /notifications/{notificationId} {
  // Los usuarios solo pueden leer sus propias notificaciones
  allow read: if isSignedIn() && resource.data.userId == request.auth.uid;

  // Admins y programadores pueden crear notificaciones
  allow create: if isAdminOrProgrammer();

  // Los usuarios pueden actualizar sus propias notificaciones (marcar como leídas)
  allow update: if isSignedIn() &&
                   resource.data.userId == request.auth.uid &&
                   request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);

  // Admins pueden actualizar cualquier notificación
  allow update: if isAdmin();

  // Solo admins pueden eliminar notificaciones
  allow delete: if isAdmin();
}
```

**Explicación:**

1. **READ**: Solo puedes leer TUS notificaciones (donde `userId == tu UID`)
2. **CREATE**: Solo admins y programadores pueden crear notificaciones
3. **UPDATE (usuario)**: Puedes actualizar solo el campo `read` de TUS notificaciones
4. **UPDATE (admin)**: Los admins pueden actualizar cualquier campo
5. **DELETE**: Solo admins pueden eliminar

**Ejemplos de seguridad:**

❌ **BLOQUEADO:**
```javascript
// Usuario intenta leer notificación de otro usuario
firebase.firestore()
  .collection('notifications')
  .doc('notif123')  // userId: "otroUsuario"
  .get();
// Error: Permission Denied
```

✅ **PERMITIDO:**
```javascript
// Usuario marca su propia notificación como leída
firebase.firestore()
  .collection('notifications')
  .doc('notif456')  // userId: "miUID"
  .update({ read: true });
// ✅ Success
```

❌ **BLOQUEADO:**
```javascript
// Usuario intenta cambiar el mensaje de una notificación
firebase.firestore()
  .collection('notifications')
  .doc('notif456')  // userId: "miUID"
  .update({ message: 'Mensaje modificado' });
// Error: Permission Denied (solo puede cambiar 'read')
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear notificación personalizada

```typescript
import { NotificationService } from './core/services/notification.service';
import { NotificationType } from './shared/interfaces/notification.interface';

// En tu componente
constructor(private notificationService: NotificationService) {}

async enviarBienvenida(userId: string, userName: string): Promise<void> {
  await this.notificationService.createNotification({
    userId: userId,
    type: NotificationType.SYSTEM,
    title: '👋 Bienvenido a PortafolioWeb',
    message: `Hola ${userName}, gracias por registrarte. Explora los perfiles de nuestros programadores.`,
    read: false,
    createdAt: new Date()
  });
}
```

---

### Ejemplo 2: Obtener contador de notificaciones no leídas

```typescript
import { NotificationService } from './core/services/notification.service';

constructor(private notificationService: NotificationService) {}

ngOnInit(): void {
  const userId = 'user123';

  this.notificationService.getUnreadCount(userId)
    .subscribe(count => {
      console.log(`Tienes ${count} notificaciones sin leer`);
    });
}
```

---

### Ejemplo 3: Marcar todas como leídas al cerrar sesión

```typescript
async logout(): Promise<void> {
  // Marcar todas como leídas antes de cerrar sesión
  if (this.currentUser?.uid) {
    await this.notificationService.markAllAsRead(this.currentUser.uid);
  }

  await this.authService.logout();
  this.router.navigate(['/login']);
}
```

---

### Ejemplo 4: Filtrar notificaciones por tipo

```typescript
ngOnInit(): void {
  this.notificationService
    .getUserNotifications(this.currentUser.uid)
    .subscribe(allNotifications => {
      // Solo notificaciones aprobadas
      const approved = allNotifications.filter(
        n => n.type === NotificationType.ADVISORY_APPROVED
      );

      // Solo notificaciones rechazadas
      const rejected = allNotifications.filter(
        n => n.type === NotificationType.ADVISORY_REJECTED
      );

      console.log('Aprobadas:', approved.length);
      console.log('Rechazadas:', rejected.length);
    });
}
```

---

### Ejemplo 5: Notificación con tiempo real

```typescript
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

ngOnInit(): void {
  // Actualizar notificaciones cada 30 segundos
  interval(30000)  // 30000ms = 30 segundos
    .pipe(
      switchMap(() => this.notificationService.getUserNotifications(this.currentUser.uid))
    )
    .subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
}
```

---

## 📊 Resumen de Archivos

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `notification.interface.ts` | `src/app/shared/interfaces/` | Define tipos y estructuras |
| `notification.service.ts` | `src/app/core/services/` | Lógica de negocio de notificaciones |
| `advisory.service.ts` | `src/app/core/services/` | Crea notificaciones al gestionar asesorías |
| `navbar.component.ts` | `src/app/shared/components/navbar/` | Muestra notificaciones en UI |
| `navbar.component.html` | `src/app/shared/components/navbar/` | Template del dropdown |
| `firestore.rules` | Raíz del proyecto | Reglas de seguridad |

---

## 🎓 Conceptos Clave

### 1. **userId vs relatedUserId**

- **userId**: El UID del usuario que **RECIBE** la notificación
- **relatedUserId**: El email/UID del usuario **RELACIONADO** (quien provocó la notificación)

**Ejemplo:**
```typescript
// Usuario "Juan" solicita asesoría al programador "Alexander"
{
  userId: "alexUID",              // Alexander recibe la notificación
  relatedUserId: "juan@email.com", // Juan provocó la notificación
  message: "Juan ha solicitado..."
}
```

---

### 2. **Observable vs Promise**

- **`getUserNotifications()`** retorna `Observable` → Actualización en tiempo real
- **`createNotification()`** retorna `Promise` → Operación única

```typescript
// Observable - Se actualiza automáticamente
this.notificationService.getUserNotifications(userId)
  .subscribe(notifications => {
    // Esto se ejecuta cada vez que hay cambios
    this.notifications = notifications;
  });

// Promise - Se ejecuta una sola vez
await this.notificationService.createNotification({...});
```

---

### 3. **Filtrado en cliente vs servidor**

Actualmente el filtrado se hace en el **cliente** (líneas 48-84 de `notification.service.ts`):

```typescript
getUserNotifications(userId: string): Observable<Notification[]> {
  return from(getDocs(notificationsRef)).pipe(
    map(snapshot => {
      const notifications: Notification[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data['userId'] === userId) {  // ← Filtrado en cliente
          notifications.push({...});
        }
      });
      return notifications;
    })
  );
}
```

**Ventaja:** Simple de implementar
**Desventaja:** Lee todos los documentos (ineficiente con muchas notificaciones)

**Mejora futura:** Usar query de Firestore para filtrar en servidor:

```typescript
const q = query(
  collection(this.firestore, 'notifications'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc')
);
```

---

## 🚀 Mejoras Futuras

1. **Paginación**: Cargar notificaciones en bloques de 10
2. **Notificaciones push**: Integrar Firebase Cloud Messaging
3. **Email real**: Integrar con EmailJS o SendGrid
4. **WhatsApp real**: Integrar con Twilio API
5. **Filtro por tipo**: Permitir al usuario filtrar notificaciones
6. **Eliminar notificaciones**: Botón para eliminar individualmente
7. **Sonido**: Reproducir sonido al recibir notificación nueva

---

## 📞 Soporte

Para preguntas sobre el sistema de notificaciones, contactar al desarrollador principal del proyecto.

---

**Última actualización:** 12 de diciembre de 2025
**Versión:** 1.0.0
