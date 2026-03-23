import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dfarmcidt';
  private apiKey = '841375346915123';
  private uploadPreset = 'portafolio_uploads'; // Crearemos este preset en Cloudinary

  constructor() {}

  /**
   * Subir imagen a Cloudinary
   * @param file - Archivo de imagen a subir
   * @returns URL de la imagen subida
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('cloud_name', this.cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      return data.secure_url; // URL segura (HTTPS) de la imagen
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Validar que el archivo sea una imagen
   * @param file - Archivo a validar
   * @returns true si es imagen válida
   */
  isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * Validar tamaño del archivo (máximo 5MB)
   * @param file - Archivo a validar
   * @returns true si es menor a 5MB
   */
  isValidSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    return file.size <= maxSize;
  }

  /**
   * Obtener URL optimizada de Cloudinary
   * @param publicId - ID público de la imagen en Cloudinary
   * @param width - Ancho deseado
   * @param height - Alto deseado
   * @returns URL optimizada
   */
  getOptimizedUrl(publicId: string, width: number = 200, height: number = 200): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${width},h_${height},c_fill,g_face,q_auto,f_auto/${publicId}`;
  }
}
