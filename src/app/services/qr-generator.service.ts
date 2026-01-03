import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrGeneratorService {

  constructor() { }

  /**
   * Genera un QR code usando la API de QR Server
   * @param url URL que debe abrir el QR
   * @param size Tamaño del QR (default: 300x300)
   * @returns URL de la imagen del QR
   */
  generateQR(url: string, size: string = '300x300'): string {
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodedUrl}`;
  }

  /**
   * Genera QR específico para la galería con parámetro de cámara
   * @param baseUrl URL base del sitio
   * @returns URL de la imagen del QR
   */
  generateGalleryQR(baseUrl: string): string {
    // URL que abre la galería y activa la cámara automáticamente
    const galleryUrl = `${baseUrl}#/post-wedding-gallery?camera=true`;
    return this.generateQR(galleryUrl, '400x400');
  }

  /**
   * Descarga el QR como imagen
   * @param qrUrl URL del QR generado
   * @param filename Nombre del archivo
   */
  downloadQR(qrUrl: string, filename: string = 'wedding-gallery-qr.png'): void {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}