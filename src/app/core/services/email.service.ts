import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  // IMPORTANTE: Reemplaza estos valores con los de tu cuenta EmailJS
  private readonly PUBLIC_KEY = 'kktEDGVaLELfRoLHg';  // Lo obtienes de: https://dashboard.emailjs.com/admin/account
  private readonly SERVICE_ID = 'service_0eplwcm';      // Tu Service ID de Gmail
  private readonly TEMPLATE_NEW_ADVISORY = 'template_l9bes1c';  // Template ID del primer template
  private readonly TEMPLATE_ADVISORY_RESPONSE = 'template_xoqq0bc';  // Template ID del segundo template

  // Configuración para formulario de contacto (segunda cuenta)
  private readonly CONTACT_PUBLIC_KEY = 'Nf-9esgxSOfmqb5zj';  // Public Key de la segunda cuenta
  private readonly CONTACT_SERVICE_ID = 'service_nw5ctfl';    // Service ID de la segunda cuenta
  private readonly CONTACT_TEMPLATE_ID = 'template_duywrn5';  // Template ID para contacto

  constructor() {
    // Inicializar EmailJS con tu Public Key
    emailjs.init(this.PUBLIC_KEY);
  }

  /**
   * Enviar notificación al programador cuando un usuario agenda una asesoría
   */
  async sendAdvisoryRequestToProgrammer(advisoryData: {
    programmerName: string;
    programmerEmail: string;
    userName: string;
    userEmail: string;
    date: Date;
    time: string;
    comment: string;
  }): Promise<void> {
    try {
      const templateParams = {
        programmer_name: advisoryData.programmerName,
        to_email: advisoryData.programmerEmail,  // Email del programador
        user_name: advisoryData.userName,
        user_email: advisoryData.userEmail,
        advisory_date: this.formatDate(advisoryData.date),
        advisory_time: advisoryData.time,
        advisory_comment: advisoryData.comment || 'Sin comentarios',
        dashboard_link: `${window.location.origin}/programmer-dashboard`  // Link al dashboard del programador
      };

      console.log('📧 Enviando email al programador:', templateParams);

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_NEW_ADVISORY,
        templateParams
      );

      console.log('✅ Email enviado exitosamente:', response);
    } catch (error) {
      console.error('❌ Error al enviar email al programador:', error);
      throw error;
    }
  }

  /**
   * Enviar notificación al usuario cuando el programador aprueba/rechaza la asesoría
   */
  async sendAdvisoryResponseToUser(advisoryData: {
    userName: string;
    userEmail: string;
    programmerName: string;
    programmerEmail: string;
    date: Date;
    time: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
  }): Promise<void> {
    try {
      const isApproved = advisoryData.status === 'approved';

      const templateParams = {
        to_email: advisoryData.userEmail,
        user_name: advisoryData.userName,
        programmer_name: advisoryData.programmerName,
        programmer_email: advisoryData.programmerEmail,
        advisory_date: this.formatDate(advisoryData.date),
        advisory_time: advisoryData.time,

        // Variables para el template
        status_text: isApproved ? 'APROBADA' : 'RECHAZADA',
        status_emoji: isApproved ? '✅' : '❌',

        // Header color según estado
        header_style: isApproved
          ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
          : 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);',

        // Badge color según estado
        badge_style: isApproved
          ? 'background: #10b981;'
          : 'background: #ef4444;',

        // Mensaje principal
        main_message: isApproved
          ? '🎉 ¡Excelente! Tu asesoría ha sido confirmada. Te esperamos en la fecha y hora indicadas.'
          : 'Lamentablemente, tu solicitud no pudo ser aceptada en esta ocasión. Puedes intentar agendar en otro horario disponible.',

        // Mensaje secundario (solo para aprobadas)
        secondary_message: isApproved
          ? '<p><strong>Importante:</strong> Si necesitas reprogramar o cancelar, por favor contacta lo antes posible.</p>'
          : '',

        // Sección de motivo de rechazo
        rejection_section: advisoryData.rejectionReason
          ? `<p><span class="label">📝 Motivo:</span><br>${advisoryData.rejectionReason}</p>`
          : ''
      };

      console.log('📧 Enviando email al usuario:', templateParams);

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ADVISORY_RESPONSE,
        templateParams
      );

      console.log('✅ Email enviado exitosamente:', response);
    } catch (error) {
      console.error('❌ Error al enviar email al usuario:', error);
      throw error;
    }
  }

  /**
   * Formatear fecha a texto legible en español
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Obtener la Public Key de EmailJS
   * Ve a: https://dashboard.emailjs.com/admin/account
   */
  getPublicKey(): string {
    return this.PUBLIC_KEY;
  }

  /**
   * Verificar si EmailJS está configurado correctamente
   */
  isConfigured(): boolean {
    return this.PUBLIC_KEY !== 'kktEDGVaLELfRoLHg' &&
           this.TEMPLATE_NEW_ADVISORY !== 'template_l9bes1c' &&
           this.TEMPLATE_ADVISORY_RESPONSE !== 'template_xoqq0bc';
  }

  /**
   * Enviar mensaje desde el formulario de contacto del portafolio
   */
  async sendContactMessage(contactData: {
    from_name: string;
    from_email: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const templateParams = {
        from_name: contactData.from_name,
        from_email: contactData.from_email,
        message: contactData.message,
      };

      console.log('📧 Enviando mensaje de contacto:', templateParams);

      // Usar la segunda cuenta de EmailJS para el formulario de contacto
      const response = await emailjs.send(
        this.CONTACT_SERVICE_ID,
        this.CONTACT_TEMPLATE_ID,
        templateParams,
        this.CONTACT_PUBLIC_KEY  // Usar la public key de la segunda cuenta
      );

      console.log('✅ Mensaje enviado exitosamente:', response);
      return {
        success: true,
        message: '¡Mensaje enviado exitosamente! Te responderé pronto.'
      };
    } catch (error) {
      console.error('❌ Error al enviar mensaje de contacto:', error);
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor intenta de nuevo.'
      };
    }
  }
}
