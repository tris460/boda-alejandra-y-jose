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
    
    const baseUrl = 'https://script.google.com/macros/s/AKfycbz256hgQax49klnR76Df_DebefOqvU5Epjxq-bbVTa7HeI07TiRl4iPU9mJ4RpzMxrLOg/exec';
    
    const params = new URLSearchParams({
      nombre: this.formData.name,
      asistencia: this.formData.attending === 'true' ? 'Sí' : 'No',
      invitados: this.formData.attending === 'true' ? this.formData.guests || '1' : '0',
      mensaje: this.formData.message || 'Sin mensaje',
      fecha: new Date().toLocaleString('es-MX')
    });
    
    const webhookUrl = `${baseUrl}?${params.toString()}`;
    
    fetch(webhookUrl, {
      method: 'GET',
      mode: 'no-cors'
    })
    .then(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.showConfirmation = true;
      }, 1500);
    })
    .catch(error => {
      console.error('Error:', error);
      setTimeout(() => {
        this.isLoading = false;
        this.showConfirmation = true;
      }, 1500);
    });
  }
  

}
