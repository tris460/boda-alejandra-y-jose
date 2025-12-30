import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-location',
  imports: [TranslatePipe],
  templateUrl: './location.html',
  styleUrl: './location.scss'
})
export class Location {

  openInMaps(): void {
    const mapsUrl = 'https://maps.app.goo.gl/XMijGBCwqNPSQLoN8';
    window.open(mapsUrl, '_blank');
  }
}
