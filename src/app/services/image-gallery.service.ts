import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app.config';

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  uploadDate: Date;
  thumbnail?: string;
}

export interface UploadResult {
  success: boolean;
  image?: GalleryImage;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageGalleryService {

  constructor() {}

  async uploadImage(file: File): Promise<UploadResult> {
    const provider = AppConfig.GALLERY.PROVIDER;
    
    switch (provider) {
      case 'cloudinary':
        return this.uploadToCloudinary(file);
      case 'firebase':
        return this.uploadToFirebase(file);
      case 'google-apps-script':
        return this.uploadToGoogleAppsScript(file);
      default:
        return { success: false, error: 'Proveedor no configurado' };
    }
  }

  async getImages(): Promise<GalleryImage[]> {
    const provider = AppConfig.GALLERY.PROVIDER;
    
    switch (provider) {
      case 'cloudinary':
        return this.getCloudinaryImages();
      case 'firebase':
        return this.getFirebaseImages();
      case 'google-apps-script':
        return this.getGoogleAppsScriptImages();
      default:
        return this.getDemoImages();
    }
  }

  // CLOUDINARY IMPLEMENTATION
  private async uploadToCloudinary(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', AppConfig.CLOUDINARY.UPLOAD_PRESET);
      formData.append('folder', 'post-wedding-gallery');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${AppConfig.CLOUDINARY.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const image: GalleryImage = {
        id: data.public_id,
        name: file.name,
        url: data.secure_url,
        thumbnail: data.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
        uploadDate: new Date(data.created_at)
      };

      // Almacenar la imagen localmente para poder mostrarla después
      this.storeCloudinaryImage(image);

      return { success: true, image };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  private async getCloudinaryImages(): Promise<GalleryImage[]> {
    try {
      console.log('🔍 Getting Cloudinary images...');
      
      // SOLUCIÓN: Mantener un registro local de imágenes subidas
      // Ya que la Admin API tiene CORS, usaremos localStorage para trackear las imágenes
      const storedImages = this.getStoredCloudinaryImages();
      
      console.log(`📦 Found ${storedImages.length} stored images in localStorage`);
      
      if (storedImages.length > 0) {
        console.log('✅ Returning stored images:', storedImages);
        return storedImages;
      }
      
      // Si no hay imágenes almacenadas, agregar algunas de ejemplo para testing
      console.log('⚠️ No stored images found. Adding sample images for testing...');
      const sampleImages = this.createSampleCloudinaryImages();
      
      if (sampleImages.length > 0) {
        // Almacenar las imágenes de ejemplo
        localStorage.setItem('cloudinary_gallery_images', JSON.stringify(sampleImages));
        console.log('✅ Sample images added to localStorage');
        return sampleImages;
      }
      
      console.log('📭 No images available. Upload some images to see them here.');
      return [];
      
    } catch (error) {
      console.error('❌ Error getting Cloudinary images:', error);
      return [];
    }
  }

  // Crear imágenes de ejemplo usando tu configuración de Cloudinary
  private createSampleCloudinaryImages(): GalleryImage[] {
    const cloudName = AppConfig.CLOUDINARY.CLOUD_NAME;
    
    // Solo crear ejemplos si tenemos configuración válida
    if (!cloudName || cloudName === 'tu-cloud-name') {
      console.log('⚠️ Cloudinary not configured properly');
      return [];
    }
    
    // Crear URLs de ejemplo usando imágenes públicas de Cloudinary
    return [
      {
        id: 'sample_wedding_1',
        name: 'Ejemplo - Anillos de boda',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/samples/wedding-rings`,
        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/v1/samples/wedding-rings`,
        uploadDate: new Date()
      },
      {
        id: 'sample_wedding_2', 
        name: 'Ejemplo - Pareja feliz',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/samples/couple-happy`,
        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/v1/samples/couple-happy`,
        uploadDate: new Date()
      },
      {
        id: 'sample_wedding_3',
        name: 'Ejemplo - Celebración',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/samples/celebration`,
        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/v1/samples/celebration`,
        uploadDate: new Date()
      }
    ];
  }

  // Obtener imágenes almacenadas localmente
  private getStoredCloudinaryImages(): GalleryImage[] {
    try {
      console.log('🔍 Checking localStorage for stored images...');
      const stored = localStorage.getItem('cloudinary_gallery_images');
      
      if (!stored) {
        console.log('📭 No images found in localStorage');
        return [];
      }
      
      console.log('📦 Raw stored data:', stored);
      const images = JSON.parse(stored);
      console.log('📋 Parsed images:', images);
      
      const processedImages = images.map((img: any) => ({
        ...img,
        uploadDate: new Date(img.uploadDate)
      }));
      
      console.log('✅ Processed images:', processedImages);
      return processedImages;
    } catch (error) {
      console.error('❌ Error reading stored images:', error);
      return [];
    }
  }

  // Almacenar imagen localmente después de subirla
  private storeCloudinaryImage(image: GalleryImage): void {
    try {
      const stored = this.getStoredCloudinaryImages();
      
      // Evitar duplicados
      const exists = stored.find(img => img.id === image.id);
      if (!exists) {
        stored.push(image);
        localStorage.setItem('cloudinary_gallery_images', JSON.stringify(stored));
        console.log('Image stored locally:', image.name);
      }
    } catch (error) {
      console.error('Error storing image locally:', error);
    }
  }

  // FIREBASE IMPLEMENTATION (placeholder)
  private async uploadToFirebase(file: File): Promise<UploadResult> {
    // TODO: Implementar Firebase Storage
    console.log('Firebase upload not implemented yet');
    return { success: false, error: 'Firebase no implementado aún' };
  }

  private async getFirebaseImages(): Promise<GalleryImage[]> {
    // TODO: Implementar Firebase Storage
    console.log('Firebase get images not implemented yet');
    return this.getDemoImages();
  }

  // GOOGLE APPS SCRIPT IMPLEMENTATION (existing)
  private async uploadToGoogleAppsScript(file: File): Promise<UploadResult> {
    try {
      const base64 = await this.fileToBase64(file);
      const uploadUrl = `${AppConfig.GOOGLE_APPS_SCRIPT_URL}?action=uploadImage` +
        `&fileName=${encodeURIComponent(file.name)}` +
        `&mimeType=${encodeURIComponent(file.type)}` +
        `&uploadDate=${encodeURIComponent(new Date().toISOString())}` +
        `&fileData=${encodeURIComponent(base64)}`;
      
      const result = await this.makeJsonpRequest(uploadUrl);
      
      if (result && result.status === 'success') {
        return { 
          success: true, 
          image: {
            id: result.image.id,
            url: result.image.url,
            name: result.image.name,
            uploadDate: new Date(result.image.uploadDate),
            thumbnail: result.image.thumbnail
          }
        };
      } else {
        throw new Error(result?.message || 'Error desconocido al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading to Google Apps Script:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  private async getGoogleAppsScriptImages(): Promise<GalleryImage[]> {
    try {
      const data = await this.makeJsonpRequest(`${AppConfig.GOOGLE_APPS_SCRIPT_URL}?action=getImages`);
      
      if (data && data.status === 'success' && data.images) {
        return data.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          name: img.name,
          uploadDate: new Date(img.uploadDate),
          thumbnail: img.thumbnail
        }));
      }
      
      throw new Error('No se pudieron obtener las imágenes');
    } catch (error) {
      console.error('Error getting Google Apps Script images:', error);
      return this.getDemoImages();
    }
  }

  // UTILITY METHODS
  private makeJsonpRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      
      const script = document.createElement('script');
      
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timeout'));
      }, 15000);
      
      const cleanup = () => {
        clearTimeout(timeoutId);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
        }
      };
      
      (window as any)[callbackName] = (data: any) => {
        cleanup();
        resolve(data);
      };
      
      script.onerror = () => {
        cleanup();
        reject(new Error('Script loading failed'));
      };
      
      script.src = url + '&callback=' + callbackName;
      script.async = true;
      document.head.appendChild(script);
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Limpiar imágenes almacenadas localmente (útil para testing)
  clearStoredImages(): void {
    localStorage.removeItem('cloudinary_gallery_images');
    console.log('Stored images cleared');
  }

  // Obtener estadísticas del almacenamiento
  getStorageStats(): { count: number; size: string } {
    const stored = this.getStoredCloudinaryImages();
    const storageSize = localStorage.getItem('cloudinary_gallery_images')?.length || 0;
    
    return {
      count: stored.length,
      size: `${(storageSize / 1024).toFixed(2)} KB`
    };
  }

  private getDemoImages(): GalleryImage[] {
    // No mostrar imágenes demo - galería vacía hasta que se configure un proveedor
    return [];
  }
}