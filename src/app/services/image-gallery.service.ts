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
  private uploadedImages: GalleryImage[] = [];
  private imageCache: { images: GalleryImage[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    console.log('🚀 ImageGalleryService initialized - Admin API mode');
  }

  async uploadImage(file: File): Promise<UploadResult> {
    try {
      console.log('📤 Uploading to Cloudinary:', file.name);
      
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
      console.log('✅ Upload successful:', data.public_id);

      const image: GalleryImage = {
        id: data.public_id,
        name: file.name,
        url: data.secure_url,
        thumbnail: data.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
        uploadDate: new Date(data.created_at)
      };

      // Add to session memory and clear cache
      this.uploadedImages.push(image);
      this.imageCache = null;
      console.log(`📝 Added to memory. Total images: ${this.uploadedImages.length}`);

      return { success: true, image };
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  async getImages(): Promise<GalleryImage[]> {
    try {
      console.log('🔍 Getting images from Cloudinary...');
      
      // Check cache first
      if (this.imageCache && (Date.now() - this.imageCache.timestamp) < this.CACHE_DURATION) {
        console.log(`✅ Returning ${this.imageCache.images.length} images from cache`);
        return this.imageCache.images;
      }
      
      // Try to get images using the resource list endpoint (public)
      const resourceListUrl = `https://res.cloudinary.com/${AppConfig.CLOUDINARY.CLOUD_NAME}/image/list/post-wedding-gallery.json`;
      
      console.log('📡 Trying resource list endpoint...');
      
      try {
        const response = await fetch(resourceListUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.resources && data.resources.length > 0) {
            console.log(`✅ Found ${data.resources.length} images via resource list`);
            
            const galleryImages = data.resources.map((resource: any) => ({
              id: resource.public_id,
              name: this.extractImageName(resource.public_id),
              url: `https://res.cloudinary.com/${AppConfig.CLOUDINARY.CLOUD_NAME}/image/upload/${resource.public_id}`,
              thumbnail: `https://res.cloudinary.com/${AppConfig.CLOUDINARY.CLOUD_NAME}/image/upload/w_400,h_300,c_fill/${resource.public_id}`,
              uploadDate: new Date()
            }));
            
            const allImages = this.combineImages(this.uploadedImages, galleryImages);
            
            this.imageCache = {
              images: allImages,
              timestamp: Date.now()
            };
            
            console.log(`✅ Total images available: ${allImages.length}`);
            return allImages;
          }
        }
      } catch (listError) {
        console.log('⚠️ Resource list not available, using session images only');
      }
      
      // Fallback: return only session images (images uploaded in this session)
      console.log(`📝 Returning ${this.uploadedImages.length} session images`);
      
      // Cache session images too
      this.imageCache = {
        images: this.uploadedImages,
        timestamp: Date.now()
      };
      
      return this.uploadedImages;
      
    } catch (error) {
      console.error('❌ Error getting images:', error);
      // Final fallback to session images
      return this.uploadedImages;
    }
  }

  private extractImageName(publicId: string): string {
    // Extract filename from public_id
    const parts = publicId.split('/');
    const fileName = parts[parts.length - 1];
    
    // Remove extension for display name
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    
    // Replace hyphens and underscores with spaces and capitalize
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private combineImages(sessionImages: GalleryImage[], discoveredImages: GalleryImage[]): GalleryImage[] {
    const allImages = [...sessionImages, ...discoveredImages];
    const uniqueImages = new Map<string, GalleryImage>();
    
    allImages.forEach(image => {
      if (!uniqueImages.has(image.id)) {
        uniqueImages.set(image.id, image);
      }
    });
    
    return Array.from(uniqueImages.values()).sort((a, b) => 
      b.uploadDate.getTime() - a.uploadDate.getTime()
    );
  }

  getStorageStats(): { count: number; size: string } {
    const cacheInfo = this.imageCache ? `Cache: ${this.imageCache.images.length} images` : 'No cache';
    return {
      count: this.uploadedImages.length,
      size: `Session: ${this.uploadedImages.length} images | ${cacheInfo} | Public: All uploaded images visible`
    };
  }

  clearCache(): void {
    this.imageCache = null;
    console.log('🧹 Cache cleared');
  }
}