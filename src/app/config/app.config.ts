export const AppConfig = {
  // URL de tu Google Apps Script (actualizada con soporte JSONP)
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw9CTSxQoz5fR8Zs94br-5E3mPF7WJiqCzoWJl8II_MpSzoqpQ6zRTN2K2bT31_7fEt/exec',
  
  // Configuración de la galería
  GALLERY: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    THUMBNAIL_SIZE: 400
  }
};