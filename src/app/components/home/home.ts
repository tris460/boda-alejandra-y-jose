import { Component, AfterViewInit, Inject } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  currentLanguage: string = 'es';

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
}
