// Estado de la asesoría
export enum AdvisoryStatus {
  PENDING = 'pending',      // Pendiente de aprobación
  APPROVED = 'approved',    // Aprobada por el programador
  REJECTED = 'rejected',    // Rechazada por el programador
  COMPLETED = 'completed',  // Completada
  CANCELLED = 'cancelled'   // Cancelada
}

// Interfaz para una asesoría
export interface Advisory {
  id?: string;
  userId: string;              // UID del usuario que solicita
  userName: string;            // Nombre del usuario
  userEmail: string;           // Email del usuario
  programmerId: string;        // UID del programador
  programmerName: string;      // Nombre del programador
  date: Date | any;            // Fecha de la asesoría
  time: string;                // Hora (ej: "10:00", "14:30")
  comment?: string;            // Comentario/motivo de la asesoría
  status: AdvisoryStatus;      // Estado actual
  responseMessage?: string;    // Mensaje del programador (aprobación/rechazo)
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

// Horarios de disponibilidad del programador
export interface Schedule {
  id?: string;
  programmerId: string;        // UID del programador
  programmerName: string;
  date: Date | any;            // Fecha específica del horario
  startTime: string;           // Hora inicio (ej: "09:00")
  endTime: string;             // Hora fin (ej: "18:00")
  isActive: boolean;           // Si está activo o no
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

// Slot de tiempo individual dentro de un horario
export interface TimeSlot {
  time: string;                // Hora del slot (ej: "09:00", "10:00")
  available: boolean;          // Si está disponible o ya reservado
  advisoryId?: string;         // ID de la asesoría si está reservado
}

// Datos para crear una nueva solicitud de asesoría
export interface AdvisoryRequest {
  programmerId: string;
  date: Date;
  time: string;
  comment?: string;
}
