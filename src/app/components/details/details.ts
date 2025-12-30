import { Component, AfterViewInit } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-details',
  imports: [TranslatePipe],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details implements AfterViewInit {
  isPlaying = false;
  private audio: HTMLAudioElement;
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private weddingDate = new Date('2026-05-02T19:00:00');

  constructor() {
    this.audio = new Audio('Sweet Child O Mine.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.5;
    this.audio.currentTime = 14;
    
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);
  }

  ngAfterViewInit() {
    const ringsImg = document.querySelector('.rings-image') as HTMLImageElement;
    if (ringsImg) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            ringsImg.classList.add('loaded');
            observer.unobserve(ringsImg);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(ringsImg);
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const distance = this.weddingDate.getTime() - now;

    if (distance > 0) {
      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
