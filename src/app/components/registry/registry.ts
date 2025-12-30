import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-registry',
  imports: [TranslatePipe],
  templateUrl: './registry.html',
  styleUrl: './registry.scss'
})
export class Registry {
  activeTab = 0;
  isTransitioning = false;
  
  cards = [
    {
      holder: 'Beatriz Martinez Pérez',
      number: '4152 3142 8496 9972',
      bankImage: 'bbva.png',
      bankName: 'BBVA'
    },
    {
      holder: 'Erick Alejandro Plácido Vázquez',
      number: '4189 1431 4826 8082',
      bankImage: 'banorte.png',
      bankName: 'Banorte'
    }
  ];
  
  showCopyMessage = false;

  selectTab(index: number) {
    if (index !== this.activeTab) {
      this.changeTab(index);
    }
  }

  previousTab() {
    const newTab = this.activeTab > 0 ? this.activeTab - 1 : this.cards.length - 1;
    this.changeTab(newTab);
  }

  nextTab() {
    const newTab = this.activeTab < this.cards.length - 1 ? this.activeTab + 1 : 0;
    this.changeTab(newTab);
  }

  private changeTab(newIndex: number) {
    this.isTransitioning = true;
    setTimeout(() => {
      this.activeTab = newIndex;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 50);
    }, 150);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.showCopyMessage = true;
    setTimeout(() => {
      this.showCopyMessage = false;
    }, 2000);
  }
}
