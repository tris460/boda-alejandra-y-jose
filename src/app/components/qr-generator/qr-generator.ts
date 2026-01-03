import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrGeneratorService } from '../../services/qr-generator.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-generator.html',
  styleUrl: './qr-generator.scss'
})
export class QrGeneratorComponent implements OnInit {
  qrImageUrl: string = '';
  galleryUrl: string = '';
  isGenerating = false;

  constructor(private qrService: QrGeneratorService) {}

  ngOnInit() {
    this.generateQR();
  }

  generateQR() {
    this.isGenerating = true;
    
    // Obtener la URL base actual
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Generar URL de la galería con parámetro de cámara
    this.galleryUrl = `${baseUrl}#/post-wedding-gallery?camera=true`;
    
    // Generar QR
    this.qrImageUrl = this.qrService.generateGalleryQR(baseUrl);
    
    this.isGenerating = false;
  }

  downloadQR() {
    this.qrService.downloadQR(this.qrImageUrl, 'boda-alejandra-jose-galeria-qr.png');
  }

  copyUrl() {
    navigator.clipboard.writeText(this.galleryUrl).then(() => {
      alert('¡URL copiada al portapapeles!');
    }).catch(() => {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = this.galleryUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡URL copiada al portapapeles!');
    });
  }

  shareUrl() {
    if (navigator.share) {
      navigator.share({
        title: 'Galería Post-Boda - Alejandra & José',
        text: 'Sube tus fotos de la boda escaneando este QR',
        url: this.galleryUrl
      });
    } else {
      this.copyUrl();
    }
  }
}