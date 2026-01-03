import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { PostWeddingGallery } from '../post-wedding-gallery/post-wedding-gallery';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslatePipe, PostWeddingGallery],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  currentLanguage: string = 'es';
  isGalleryModalOpen = false;

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const img = document.querySelector('.main-image') as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    }, 100);
  }

  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
    this.translationService.setLanguage(newLanguage);
    this.currentLanguage = newLanguage;
  }

  openGalleryModal() {
    this.isGalleryModalOpen = true;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  closeGalleryModal() {
    this.isGalleryModalOpen = false;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }
}
