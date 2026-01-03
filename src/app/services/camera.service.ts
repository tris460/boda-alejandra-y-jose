import { Injectable } from '@angular/core';

export interface CameraPhoto {
  blob: Blob;
  dataUrl: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;

  constructor() { }

  /**
   * Verifica si la cámara está disponible
   */
  async isCameraAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  }

  /**
   * Inicia la cámara
   */
  async startCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    try {
      // Preferir cámara trasera en móviles
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Cámara trasera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      
      return this.stream;
    } catch (error) {
      console.error('Error starting camera:', error);
      
      // Fallback: intentar con cámara frontal
      try {
        const fallbackConstraints: MediaStreamConstraints = {
          video: {
            facingMode: 'user', // Cámara frontal
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        
        this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        videoElement.srcObject = this.stream;
        
        return this.stream;
      } catch (fallbackError) {
        console.error('Error with fallback camera:', fallbackError);
        throw new Error('No se pudo acceder a la cámara');
      }
    }
  }

  /**
   * Captura una foto de la cámara
   */
  capturePhoto(videoElement: HTMLVideoElement): Promise<CameraPhoto> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        // Configurar el canvas con las dimensiones del video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Dibujar el frame actual del video en el canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convertir a blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('No se pudo crear la imagen'));
            return;
          }

          // Crear data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Crear archivo
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const file = new File([blob], `photo-${timestamp}.jpg`, { 
            type: 'image/jpeg' 
          });

          resolve({
            blob,
            dataUrl,
            file
          });
        }, 'image/jpeg', 0.8);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Detiene la cámara
   */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Cambia entre cámara frontal y trasera
   */
  async switchCamera(videoElement: HTMLVideoElement, useFrontCamera: boolean): Promise<MediaStream> {
    this.stopCamera();
    
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: useFrontCamera ? 'user' : { ideal: 'environment' },
        width: { ideal: useFrontCamera ? 1280 : 1920 },
        height: { ideal: useFrontCamera ? 720 : 1080 }
      },
      audio: false
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = this.stream;
    
    return this.stream;
  }
}