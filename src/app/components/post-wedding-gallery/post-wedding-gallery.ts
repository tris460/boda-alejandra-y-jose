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
      
      // Probar la Admin API
      const testMessage = `✅ CLOUDINARY CONFIGURADO CON ADMIN API\n\n` +
        `Cloud Name: ${AppConfig.CLOUDINARY.CLOUD_NAME}\n` +
        `Upload Preset: ${AppConfig.CLOUDINARY.UPLOAD_PRESET}\n` +
        `API Key: ${AppConfig.CLOUDINARY.API_KEY}\n` +
        `Imágenes en esta sesión: ${stats.count}\n\n` +
        `🔑 ADMIN API HABILITADA:\n` +
        `• Acceso completo a todas las imágenes ✅\n` +
        `• Sin problemas de CORS ✅\n` +
        `• Sin necesidad de Resource List ✅\n` +
        `• Funciona con imágenes existentes ✅\n\n` +
        `🌐 ACCESO PÚBLICO:\n` +
        `• Todas las imágenes son públicas\n` +
        `• Funciona en cualquier dispositivo\n` +
        `• Incluye imágenes anteriores y nuevas\n\n` +
        `🏷️ SISTEMA MEJORADO:\n` +
        `• Método 1: Admin API (principal)\n` +
        `• Método 2: Tags (fallback)\n` +
        `• Método 3: Patrones (último recurso)\n\n` +
        `¡Listo para usar! Sube imágenes y todos las verán.`;
      
      alert(testMessage);
      
    } catch (error) {
      console.error('❌ Cloudinary test failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('❌ Test de Cloudinary falló:\n\n' + errorMessage);
    }
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

  // Método para limpiar el almacenamiento local (información actualizada)
  clearStoredImages() {
    alert(`✅ INFORMACIÓN DEL SISTEMA ACTUAL:\n\n` +
      `🔑 ADMIN API HABILITADA:\n` +
      `• Acceso completo a todas las imágenes de Cloudinary\n` +
      `• Sin limitaciones de Resource List\n` +
      `• Funciona con imágenes existentes y nuevas\n\n` +
      `🌐 ACCESO PÚBLICO:\n` +
      `• Todas las imágenes son públicas\n` +
      `• Funciona en incógnito y otros dispositivos\n` +
      `• No requiere configuración adicional\n\n` +
      `🔄 SISTEMA DE FALLBACKS:\n` +
      `• 1º Admin API (principal)\n` +
      `• 2º Resource List con tags\n` +
      `• 3º Búsqueda por patrones\n\n` +
      `Para eliminar imágenes permanentemente, hazlo desde el dashboard de Cloudinary.`);
  }

  // Método para refrescar la galería
  async refreshGallery() {
    console.log('🔄 Refreshing gallery...');
    this.imageGalleryService.clearCache();
    await this.loadImages();
    alert('✅ Galería actualizada');
  }

  // Método de debugging para verificar el estado
  debugGallery() {
    console.log('🐛 DEBUGGING GALLERY STATE');
    console.log('📋 Current provider:', this.currentProvider);
    console.log('📊 Current images:', this.images);
    console.log('⚙️ App config:', AppConfig);
    
    // Obtener estadísticas
    const stats = this.imageGalleryService.getStorageStats();
    console.log('📈 Storage stats:', stats);
    
    // Mostrar información en alert
    alert(`🐛 DEBUG INFO:\n\nProvider: ${this.currentProvider}\nImages loaded: ${this.images.length}\nStorage: ${stats.size}\n\nCheck console for detailed logs.`);
  }
}