import { Component, AfterViewInit } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {
  ngAfterViewInit() {
    setTimeout(() => {
      const img = document.querySelector('.main-image') as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    }, 100);
  }
}
