import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService, CameraPhoto } from '../../services/camera.service';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-capture.html',
  styleUrl: './camera-capture.scss'
})
export class CameraCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() photoTaken = new EventEmitter<CameraPhoto>();
  @Output() cancelled = new EventEmitter<void>();

  isLoading = true;
  error: string | null = null;
  isCapturing = false;
  useFrontCamera = false;
  cameraAvailable = false;

  constructor(private cameraService: CameraService) {}

  async ngOnInit() {
    await this.checkCameraAndStart();
  }

  ngOnDestroy() {
    this.cameraService.stopCamera();
  }

  private async checkCameraAndStart() {
    try {
      this.isLoading = true;
      this.error = null;

      // Verificar si la cámara está disponible
      this.cameraAvailable = await this.cameraService.isCameraAvailable();
      
      if (!this.cameraAvailable) {
        this.error = 'No se encontró ninguna cámara disponible';
        this.isLoading = false;
        return;
      }

      // Iniciar la cámara
      await this.cameraService.startCamera(this.videoElement.nativeElement);
      this.isLoading = false;

    } catch (error) {
      console.error('Error starting camera:', error);
      this.error = error instanceof Error ? error.message : 'Error al acceder a la cámara';
      this.isLoading = false;
    }
  }

  async capturePhoto() {
    if (this.isCapturing) return;

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
    this.checkCameraAndStart();
  }
}