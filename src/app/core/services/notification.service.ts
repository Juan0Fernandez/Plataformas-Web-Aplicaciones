import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Notification, NotificationType, ExternalNotification } from '../../shared/interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private firestore: Firestore) {}

  /**
   * Crea una nueva notificación
   */
  async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    try {
      const notificationsRef = collection(this.firestore, 'notifications');
      const docRef = await addDoc(notificationsRef, {
        ...notification,
        createdAt: Timestamp.now()
      });

      console.log('✅ Notificación creada:', docRef.id);

      // Simular envío externo si es necesario
      if (notification.type === NotificationType.ADVISORY_APPROVED ||
          notification.type === NotificationType.ADVISORY_REJECTED) {
        await this.simulateExternalNotification(notification);
      }

      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando notificación:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las notificaciones de un usuario
   */
  getUserNotifications(userId: string): Observable<Notification[]> {
    const notificationsRef = collection(this.firestore, 'notifications');

    return from(getDocs(notificationsRef)).pipe(
      map(snapshot => {
        const notifications: Notification[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data['userId'] === userId) {
            notifications.push({
              id: doc.id,
              userId: data['userId'],
              type: data['type'],
              title: data['title'],
              message: data['message'],
              read: data['read'],
              createdAt: data['createdAt']?.toDate() || new Date(),
              advisoryId: data['advisoryId'],
              relatedUserId: data['relatedUserId'],
              relatedUserName: data['relatedUserName'],
              relatedUserEmail: data['relatedUserEmail'],
              advisoryDate: data['advisoryDate'],
              advisoryTime: data['advisoryTime'],
              sentByEmail: data['sentByEmail'],
              sentByWhatsApp: data['sentByWhatsApp']
            });
          }
        });

        // Ordenar por fecha de creación (más recientes primero)
        notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log(`📬 Notificaciones obtenidas para usuario ${userId}:`, notifications);

        // Actualizar contador de no leídas
        const unreadCount = notifications.filter(n => !n.read).length;
        this.unreadCountSubject.next(unreadCount);

        return notifications;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo notificaciones:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene solo las notificaciones no leídas de un usuario
   */
  getUnreadNotifications(userId: string): Observable<Notification[]> {
    return this.getUserNotifications(userId).pipe(
      map(notifications => notifications.filter(n => !n.read))
    );
  }

  /**
   * Marca una notificación como leída
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(this.firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      console.log('✅ Notificación marcada como leída:', notificationId);
    } catch (error) {
      console.error('❌ Error marcando notificación como leída:', error);
      throw error;
    }
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notificationsRef = collection(this.firestore, 'notifications');
      const snapshot = await getDocs(notificationsRef);

      const updatePromises: Promise<void>[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data['userId'] === userId && !data['read']) {
          const notificationRef = doc.ref;
          updatePromises.push(updateDoc(notificationRef, { read: true }));
        }
      });

      await Promise.all(updatePromises);
      this.unreadCountSubject.next(0);
      console.log('✅ Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('❌ Error marcando todas como leídas:', error);
      throw error;
    }
  }

  /**
   * Obtiene el contador de notificaciones no leídas
   */
  getUnreadCount(userId: string): Observable<number> {
    return this.getUnreadNotifications(userId).pipe(
      map(notifications => notifications.length)
    );
  }

  /**
   * Crea una notificación cuando se solicita una asesoría
   */
  async notifyAdvisoryRequested(
    programmerId: string,
    programmerName: string,
    userName: string,
    userEmail: string,
    advisoryId: string,
    date: string,
    time: string
  ): Promise<void> {
    await this.createNotification({
      userId: programmerId,
      type: NotificationType.ADVISORY_REQUESTED,
      title: '📅 Nueva Solicitud de Asesoría',
      message: `${userName} (${userEmail}) ha solicitado una asesoría para el ${date} a las ${time}`,
      read: false,
      createdAt: new Date(),
      advisoryId,
      relatedUserId: userEmail,
      relatedUserName: userName,
      relatedUserEmail: userEmail,
      advisoryDate: date,
      advisoryTime: time
    });
  }

  /**
   * Crea una notificación cuando se aprueba una asesoría
   */
  async notifyAdvisoryApproved(
    userId: string,
    userName: string,
    programmerName: string,
    programmerEmail: string,
    advisoryId: string,
    date: string,
    time: string,
    responseMessage?: string
  ): Promise<void> {
    const message = responseMessage
      ? `${programmerName} ha aprobado tu asesoría para el ${date} a las ${time}. Mensaje: "${responseMessage}"`
      : `${programmerName} ha aprobado tu asesoría para el ${date} a las ${time}`;

    await this.createNotification({
      userId,
      type: NotificationType.ADVISORY_APPROVED,
      title: '✅ Asesoría Aprobada',
      message,
      read: false,
      createdAt: new Date(),
      advisoryId,
      relatedUserId: programmerEmail,
      relatedUserName: programmerName,
      relatedUserEmail: programmerEmail,
      advisoryDate: date,
      advisoryTime: time,
      sentByEmail: true,
      sentByWhatsApp: true
    });
  }

  /**
   * Crea una notificación cuando se rechaza una asesoría
   */
  async notifyAdvisoryRejected(
    userId: string,
    userName: string,
    programmerName: string,
    programmerEmail: string,
    advisoryId: string,
    date: string,
    time: string,
    responseMessage?: string
  ): Promise<void> {
    const message = responseMessage
      ? `${programmerName} ha rechazado tu solicitud de asesoría. Mensaje: "${responseMessage}"`
      : `${programmerName} ha rechazado tu solicitud de asesoría`;

    await this.createNotification({
      userId,
      type: NotificationType.ADVISORY_REJECTED,
      title: '❌ Asesoría Rechazada',
      message,
      read: false,
      createdAt: new Date(),
      advisoryId,
      relatedUserId: programmerEmail,
      relatedUserName: programmerName,
      relatedUserEmail: programmerEmail,
      advisoryDate: date,
      advisoryTime: time,
      sentByEmail: true,
      sentByWhatsApp: true
    });
  }

  /**
   * Simula el envío de notificaciones externas (Email/WhatsApp)
   */
  private async simulateExternalNotification(notification: Omit<Notification, 'id'>): Promise<void> {
    // Simular envío de email
    const emailNotification: ExternalNotification = {
      to: notification.relatedUserEmail || '',
      subject: notification.title,
      message: notification.message,
      type: 'email',
      status: 'sent',
      sentAt: new Date()
    };

    console.log('📧 [SIMULACIÓN] Email enviado:', emailNotification);

    // Simular envío de WhatsApp
    const whatsappNotification: ExternalNotification = {
      to: notification.relatedUserEmail || '', // En producción sería el número de teléfono
      subject: notification.title,
      message: notification.message,
      type: 'whatsapp',
      status: 'sent',
      sentAt: new Date()
    };

    console.log('📱 [SIMULACIÓN] WhatsApp enviado:', whatsappNotification);

    // Guardar log de notificaciones externas en Firestore (opcional)
    try {
      const externalNotificationsRef = collection(this.firestore, 'externalNotifications');
      await addDoc(externalNotificationsRef, {
        ...emailNotification,
        sentAt: Timestamp.now()
      });
      await addDoc(externalNotificationsRef, {
        ...whatsappNotification,
        sentAt: Timestamp.now()
      });
    } catch (error) {
      console.error('❌ Error guardando log de notificaciones externas:', error);
    }
  }

  /**
   * Obtiene el ícono según el tipo de notificación
   */
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.ADVISORY_REQUESTED:
        return '📅';
      case NotificationType.ADVISORY_APPROVED:
        return '✅';
      case NotificationType.ADVISORY_REJECTED:
        return '❌';
      case NotificationType.ADVISORY_COMPLETED:
        return '🎉';
      case NotificationType.SYSTEM:
        return '🔔';
      default:
        return '📬';
    }
  }

  /**
   * Obtiene el color según el tipo de notificación
   */
  getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.ADVISORY_REQUESTED:
        return 'bg-blue-600/20 border-blue-600/50';
      case NotificationType.ADVISORY_APPROVED:
        return 'bg-green-600/20 border-green-600/50';
      case NotificationType.ADVISORY_REJECTED:
        return 'bg-red-600/20 border-red-600/50';
      case NotificationType.ADVISORY_COMPLETED:
        return 'bg-purple-600/20 border-purple-600/50';
      case NotificationType.SYSTEM:
        return 'bg-yellow-600/20 border-yellow-600/50';
      default:
        return 'bg-gray-600/20 border-gray-600/50';
    }
  }
}
