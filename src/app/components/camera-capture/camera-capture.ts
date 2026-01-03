import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService, CameraPhoto } from '../../services/camera.service';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-capture.html',
  styleUrl: './camera-capture.scss'
})
export class CameraCaptureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() photoTaken = new EventEmitter<CameraPhoto>();
  @Output() cancelled = new EventEmitter<void>();

  isLoading = true;
  error: string | null = null;
  isCapturing = false;
  useFrontCamera = false;
  cameraAvailable = false;
  viewInitialized = false;

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    // Solo verificar disponibilidad de cámara aquí
    this.checkCameraAvailability();
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.cameraAvailable) {
      this.startCamera();
    }
  }

  ngOnDestroy() {
    this.cameraService.stopCamera();
  }

  private async checkCameraAvailability() {
    try {
      this.cameraAvailable = await this.cameraService.isCameraAvailable();
      
      if (!this.cameraAvailable) {
        this.error = 'No se encontró ninguna cámara disponible';
        this.isLoading = false;
        return;
      }

      // Si la vista ya está inicializada, iniciar la cámara
      if (this.viewInitialized) {
        this.startCamera();
      }

    } catch (error) {
      console.error('Error checking camera availability:', error);
      this.error = 'Error al verificar la disponibilidad de la cámara';
      this.isLoading = false;
    }
  }

  private async startCamera() {
    if (!this.videoElement?.nativeElement) {
      console.error('Video element not available');
      this.error = 'Error: elemento de video no disponible';
      this.isLoading = false;
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;

      await this.cameraService.startCamera(this.videoElement.nativeElement);
      this.isLoading = false;

    } catch (error) {
      console.error('Error starting camera:', error);
      this.error = error instanceof Error ? error.message : 'Error al acceder a la cámara';
      this.isLoading = false;
    }
  }

  async capturePhoto() {
    if (this.isCapturing || !this.videoElement?.nativeElement) return;

    try {
      this.isCapturing = true;
      
      const photo = await this.cameraService.capturePhoto(this.videoElement.nativeElement);
      this.photoTaken.emit(photo);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      this.error = 'Error al capturar la foto';
    } finally {
      this.isCapturing = false;
    }
  }

  async switchCamera() {
    if (!this.videoElement?.nativeElement) return;

    try {
      this.isLoading = true;
      this.useFrontCamera = !this.useFrontCamera;
      
      await this.cameraService.switchCamera(
        this.videoElement.nativeElement, 
        this.useFrontCamera
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error switching camera:', error);
      this.error = 'Error al cambiar de cámara';
      this.isLoading = false;
    }
  }

  cancel() {
    this.cancelled.emit();
  }

  retry() {
    this.error = null;
    this.isLoading = true;
    
    if (this.viewInitialized && this.cameraAvailable) {
      this.startCamera();
    } else {
      this.checkCameraAvailability();
    }
  }
}