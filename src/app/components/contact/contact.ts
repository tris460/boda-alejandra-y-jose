import { Component, AfterViewInit } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  imports: [TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements AfterViewInit {

  ngAfterViewInit() {
    const contactCards = document.querySelectorAll('.contact-person') as NodeListOf<HTMLElement>;
    
    contactCards.forEach((card, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.classList.add('loaded');
            }, index * 200);
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(card);
    });
  }
}
