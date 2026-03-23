export enum NotificationType {
  ADVISORY_REQUESTED = 'advisory_requested',
  ADVISORY_APPROVED = 'advisory_approved',
  ADVISORY_REJECTED = 'advisory_rejected',
  ADVISORY_COMPLETED = 'advisory_completed',
  SYSTEM = 'system'
}

export interface Notification {
  id?: string;
  userId: string; // Usuario que recibe la notificación
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;

  // Datos adicionales según el tipo
  advisoryId?: string;
  relatedUserId?: string; // ID del usuario relacionado (programador o solicitante)
  relatedUserName?: string;
  relatedUserEmail?: string;

  // Información adicional para asesorías
  advisoryDate?: string;
  advisoryTime?: string;

  // Para notificaciones externas
  sentByEmail?: boolean;
  sentByWhatsApp?: boolean;
}

export interface ExternalNotification {
  to: string; // Email o número de teléfono
  subject: string;
  message: string;
  type: 'email' | 'whatsapp';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
}
