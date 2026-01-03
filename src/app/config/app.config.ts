export const AppConfig = {
  // Configuración de Cloudinary (alternativa a Google Apps Script)
  CLOUDINARY: {
    CLOUD_NAME: 'dryqm0ye4', // Cambiar por tu cloud name
    UPLOAD_PRESET: 'post-wedding-gallery-a-y-j', // Preset sin autenticación
    API_KEY: '749477636633875' // Solo para lectura
  },
  
  // URL de Google Apps Script (backup)
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxyA6v9mjTnXTBGfQUqLeXDY_2djJpeNgoSV-bucbDoIPFLxR0xhdOdpXTPx__dwo7p/exec',
  
  // Configuración de la galería
  GALLERY: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    THUMBNAIL_SIZE: 400,
    // Usar Cloudinary como proveedor principal
    PROVIDER: 'cloudinary' // 'cloudinary' | 'firebase' | 'google-apps-script'
  }
};