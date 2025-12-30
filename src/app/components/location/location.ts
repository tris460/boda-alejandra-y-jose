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
    const mapsUrl = 'https://maps.app.goo.gl/QuzFfLCPyfCz9nDe8';
    window.open(mapsUrl, '_blank');
  }

  openInMaps2(): void {
    const mapsUrl = 'https://maps.app.goo.gl/bdtXmoKku5Hw5f5w5?g_st=iw';
    window.open(mapsUrl, '_blank');
  }
}
