import { Component, AfterViewInit } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-itinerary',
  imports: [TranslatePipe],
  templateUrl: './itinerary.html',
  styleUrl: './itinerary.scss'
})
export class Itinerary implements AfterViewInit {

  ngAfterViewInit() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }
}
