import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { AppConfig } from '../../config/app.config';

interface GalleryImage {
  id: string;
  url: string;
  name: string;
  uploadDate: Date;
  thumbnail?: string;
}

@Component({
  selector: 'app-post-wedding-gallery',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './post-wedding-gallery.html',
  styleUrl: './post-wedding-gallery.scss'
})
export class PostWeddingGallery implements OnInit, OnChanges {
  @Input() currentLanguage: string = 'es';
  
  images: GalleryImage[] = [];
  isLoading = false;
  isUploading = false;
  selectedImage: GalleryImage | null = null;
  
  // URL del Google Apps Script para manejar imágenes
  private readonly APPS_SCRIPT_URL = AppConfig.GOOGLE_APPS_SCRIPT_URL;

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    // Asegurar que el servicio de traducción use el idioma correcto
    this.translationService.setLanguage(this.currentLanguage);
    this.loadImages();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar el idioma cuando cambie el input
    if (changes['currentLanguage'] && !changes['currentLanguage'].firstChange) {
      this.translationService.setLanguage(this.currentLanguage);
    }
  }

  async loadImages() {
    this.isLoading = true;
    try {
      // Usar JSONP para evitar problemas de CORS
      const data = await this.makeJsonpRequest(`${this.APPS_SCRIPT_URL}?action=getImages`);
      
      if (data.status === 'success') {
        this.images = data.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          name: img.name,
          uploadDate: new Date(img.uploadDate),
          thumbnail: img.thumbnail
        }));
      } else {
        console.error('Error from server:', data.message);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Función para hacer requests JSONP
  private makeJsonpRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      // Crear el script tag
      const script = document.createElement('script');
      script.src = url + '&callback=' + callbackName;
      
      // Crear la función callback global
      (window as any)[callbackName] = (data: any) => {
        // Limpiar
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        resolve(data);
      };
      
      // Manejar errores
      script.onerror = () => {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        reject(new Error('JSONP request failed'));
      };
      
      // Agregar el script al DOM
      document.head.appendChild(script);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadImage(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async uploadImage(file: File) {
    if (!this.isValidImageFile(file)) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF)');
      return;
    }

    if (file.size > AppConfig.GALLERY.MAX_FILE_SIZE) {
      alert('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    this.isUploading = true;
    
    try {
      // Convertir archivo a base64
      const base64 = await this.fileToBase64(file);
      
      const formData = {
        action: 'uploadImage',
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
        uploadDate: new Date().toISOString()
      };

      const response = await fetch(this.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        // Recargar imágenes para mostrar la nueva
        await this.loadImages();
        alert('¡Imagen subida exitosamente!');
      } else {
        throw new Error(result.message || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      this.isUploading = false;
    }
  }

  private isValidImageFile(file: File): boolean {
    return AppConfig.GALLERY.ALLOWED_TYPES.includes(file.type);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:image/...;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  goBack() {
    window.history.back();
  }

  trackByImageId(index: number, image: GalleryImage): string {
    return image.id;
  }

  openImageModal(image: GalleryImage) {
    this.selectedImage = image;
  }

  closeImageModal() {
    this.selectedImage = null;
  }
}