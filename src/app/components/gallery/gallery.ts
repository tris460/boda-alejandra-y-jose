import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  private autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngAfterViewInit() {
    const galleryContainer = document.querySelector('.gallery-container') as HTMLElement;
    if (galleryContainer) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            galleryContainer.classList.add('loaded');
            observer.unobserve(galleryContainer);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(galleryContainer);
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 3;
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? 2 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  getSlideClass(index: number): string {
    if (index === this.currentSlide) {
      return 'active';
    } else if (index < this.currentSlide || (this.currentSlide === 0 && index === 2)) {
      return 'prev';
    } else {
      return '';
    }
  }
}
