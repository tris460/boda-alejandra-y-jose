import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-rsvp',
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './rsvp.html',
  styleUrl: './rsvp.scss'
})
export class Rsvp {
  
  formData = {
    name: '',
    attending: null as string | null,
    guests: null as string | null,
    message: ''
  };
  
  showErrors = false;
  showConfirmation = false;
  isLoading = false;

  onSubmit() {
    this.showErrors = true;
    
    // Validar campos requeridos
    const isNameValid = this.formData.name && this.formData.name.trim() !== '';
    const isAttendingValid = this.formData.attending !== null;
    const isGuestsValid = this.formData.attending !== 'true' || !!this.formData.guests;

    if (isNameValid && isAttendingValid && isGuestsValid) {
      this.sendToGoogleSheets();
    }
  }
  
  isNameInvalid(): boolean {
    return this.showErrors && (!this.formData.name || this.formData.name.trim() === '');
  }
  
  isAttendingInvalid(): boolean {
    return this.showErrors && this.formData.attending === null;
  }
  
  isGuestsInvalid(): boolean {
    return this.showErrors && this.formData.attending === 'true' && !this.formData.guests;
  }
  
  resetForm(): void {
    this.formData = {
      name: '',
      attending: null,
      guests: null,
      message: ''
    };
    this.showErrors = false;
    this.showConfirmation = false;
  }
  
  isFormValid(): boolean {
    const isNameValid = !!(this.formData.name && this.formData.name.trim() !== '');
    const isAttendingValid = this.formData.attending !== null;
    const isGuestsValid = this.formData.attending !== 'true' || !!this.formData.guests;
    
    return isNameValid && isAttendingValid && isGuestsValid;
  }
  
  sendToGoogleSheets(): void {
    this.isLoading = true;
    
    // URL del Google Apps Script con tu ID real
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbza0VRlc7qsZx1FSFugk2Jl3VgRT9mUl1axVHqxqkIlORDd2d62zihzyUHxnLqmZsZT/exec';
    
    // Preparar parámetros para GET
    const params = new URLSearchParams({
      nombre: this.formData.name,
      asistencia: this.formData.attending === 'true' ? 'Sí' : 'No',
      invitados: this.formData.attending === 'true' ? this.formData.guests || '1' : '0',
      mensaje: this.formData.message || 'Sin mensaje',
      fecha: new Date().toLocaleString('es-MX')
    });
    
    const fullUrl = `${scriptUrl}?${params.toString()}`;
    
    console.log('Enviando datos a:', fullUrl);
    console.log('Datos:', {
      nombre: this.formData.name,
      asistencia: this.formData.attending === 'true' ? 'Sí' : 'No',
      invitados: this.formData.attending === 'true' ? this.formData.guests || '1' : '0',
      mensaje: this.formData.message || 'Sin mensaje'
    });
    
    // Intentar con GET primero (más simple para debugging)
    fetch(fullUrl, {
      method: 'GET',
      mode: 'no-cors'
    })
    .then(() => {
      console.log('Respuesta enviada exitosamente');
      setTimeout(() => {
        this.isLoading = false;
        this.showConfirmation = true;
      }, 1500);
    })
    .catch(error => {
      console.error('Error al enviar:', error);
      setTimeout(() => {
        this.isLoading = false;
        this.showConfirmation = true; // Mostramos confirmación de todas formas
      }, 1500);
    });
  }
  

}
