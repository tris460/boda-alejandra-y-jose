import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { ImageGalleryService, GalleryImage } from '../../services/image-gallery.service';
import { AppConfig } from '../../config/app.config';

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
  
  // Información del proveedor actual
  currentProvider = AppConfig.GALLERY.PROVIDER;

  constructor(
    private translationService: TranslationService,
    private imageGalleryService: ImageGalleryService
  ) {}

  ngOnInit() {
    this.translationService.setLanguage(this.currentLanguage);
    this.loadImages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentLanguage'] && !changes['currentLanguage'].firstChange) {
      this.translationService.setLanguage(this.currentLanguage);
    }
  }

  async loadImages() {
    this.isLoading = true;
    console.log(`🔄 Loading images using provider: ${this.currentProvider}`);
    
    try {
      this.images = await this.imageGalleryService.getImages();
      console.log(`✅ Successfully loaded ${this.images.length} images:`, this.images);
    } catch (error) {
      console.error('❌ Error loading images:', error);
      this.images = [];
    } finally {
      this.isLoading = false;
    }
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
    console.log(`Uploading image using provider: ${this.currentProvider}`);
    
    try {
      const result = await this.imageGalleryService.uploadImage(file);
      
      if (result.success && result.image) {
        alert('¡Imagen subida exitosamente!');
        await this.loadImages(); // Recargar la galería
      } else {
        throw new Error(result.error || 'Error desconocido al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (this.currentProvider === 'cloudinary') {
        alert(`Error al subir imagen a Cloudinary:\n\n${errorMessage}\n\nVerifica tu configuración de Cloudinary en app.config.ts`);
      } else {
        alert(`Error al subir imagen:\n\n${errorMessage}`);
      }
    } finally {
      this.isUploading = false;
    }
  }

  private isValidImageFile(file: File): boolean {
    return AppConfig.GALLERY.ALLOWED_TYPES.includes(file.type);
  }

  goBack() {
    window.history.back();
  }

  trackByImageId(_index: number, image: GalleryImage): string {
    return image.id;
  }

  openImageModal(image: GalleryImage) {
    this.selectedImage = image;
  }

  closeImageModal() {
    this.selectedImage = null;
  }

  // Método para cambiar de proveedor (para testing)
  switchProvider(provider: 'cloudinary' | 'firebase' | 'google-apps-script') {
    console.log(`Switching to provider: ${provider}`);
    // Esto requeriría actualizar la configuración dinámicamente
    // Por ahora solo mostramos el mensaje
    alert(`Para cambiar a ${provider}, actualiza GALLERY.PROVIDER en app.config.ts y reinicia la aplicación.`);
  }

  // Método para probar la conexión del proveedor actual
  async testCurrentProvider() {
    console.log(`🧪 Testing ${this.currentProvider} provider...`);
    
    if (this.currentProvider === 'cloudinary') {
      await this.testCloudinary();
    } else if (this.currentProvider === 'google-apps-script') {
      await this.testGoogleAppsScript();
    } else {
      alert(`Testing para ${this.currentProvider} no implementado aún.`);
    }
  }

  private async testCloudinary() {
    try {
      console.log('🧪 Testing Cloudinary configuration...');
      
      // Mostrar estadísticas del almacenamiento local
      const stats = this.imageGalleryService.getStorageStats();
      console.log('📊 Storage stats:', stats);
      
      // Crear una imagen de prueba muy pequeña (1x1 pixel)
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 1, 1);
      }
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const testFile = new File([blob], 'test.png', { type: 'image/png' });
          console.log('🧪 Uploading test image...');
          
          const result = await this.imageGalleryService.uploadImage(testFile);
          
          if (result.success) {
            alert(`✅ ¡Cloudinary funciona correctamente!\n\nImagen de prueba subida exitosamente.\nImágenes almacenadas: ${stats.count + 1}`);
            await this.loadImages(); // Recargar para mostrar la imagen de prueba
          } else {
            alert('❌ Error en Cloudinary:\n\n' + (result.error || 'Error desconocido'));
          }
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('❌ Cloudinary test failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('❌ Test de Cloudinary falló:\n\n' + errorMessage);
    }
  }

  // Método para limpiar el almacenamiento local (útil para testing)
  clearStoredImages() {
    if (confirm('¿Estás seguro de que quieres limpiar todas las imágenes almacenadas localmente?\n\nEsto no borra las imágenes de Cloudinary, solo el registro local.')) {
      this.imageGalleryService.clearStoredImages();
      this.loadImages(); // Recargar la galería
      alert('Almacenamiento local limpiado. Las imágenes aparecerán de nuevo cuando las subas.');
    }
  }

  // Método de debugging para verificar el estado
  debugGallery() {
    console.log('🐛 DEBUGGING GALLERY STATE');
    console.log('📋 Current provider:', this.currentProvider);
    console.log('📊 Current images:', this.images);
    console.log('⚙️ App config:', AppConfig);
    
    // Verificar localStorage
    const stored = localStorage.getItem('cloudinary_gallery_images');
    console.log('💾 localStorage content:', stored);
    
    // Obtener estadísticas
    const stats = this.imageGalleryService.getStorageStats();
    console.log('📈 Storage stats:', stats);
    
    // Mostrar información en alert
    alert(`🐛 DEBUG INFO:\n\nProvider: ${this.currentProvider}\nImages loaded: ${this.images.length}\nStored images: ${stats.count}\nStorage size: ${stats.size}\n\nCheck console for detailed logs.`);
  }

  private async testGoogleAppsScript() {
    // Mantener el método original para Google Apps Script
    console.log('🧪 INICIANDO PRUEBA DE GOOGLE APPS SCRIPT');
    
    try {
      const images = await this.imageGalleryService.getImages();
      console.log('✅ Google Apps Script test successful:', images);
      alert(`✅ ¡Google Apps Script funciona!\n\nImágenes encontradas: ${images.length}`);
    } catch (error) {
      console.error('❌ Google Apps Script test failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('❌ Google Apps Script falló:\n\n' + errorMessage);
    }
  }
}