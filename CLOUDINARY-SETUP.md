# Configuración de Cloudinary para la Galería Post-Boda

## ¿Por qué Cloudinary?

Cloudinary es mucho más simple y confiable que Google Apps Script para manejar imágenes:

- ✅ **Sin problemas de CORS** - API REST estándar
- ✅ **Configuración simple** - Solo necesitas 3 valores
- ✅ **Plan gratuito generoso** - 25GB de almacenamiento, 25GB de ancho de banda
- ✅ **Transformaciones automáticas** - Thumbnails, redimensionado, optimización
- ✅ **CDN global** - Imágenes se cargan rápido desde cualquier parte del mundo
- ✅ **Sin límites de tiempo** - No hay timeouts como en Google Apps Script

## Pasos para configurar Cloudinary:

### 1. Crear cuenta gratuita
- Ve a: https://cloudinary.com/users/register/free
- Regístrate con tu email
- Confirma tu cuenta

### 2. Obtener credenciales
Una vez en tu dashboard de Cloudinary, verás:
- **Cloud Name** (ejemplo: `mi-boda-2024`)
- **API Key** (ejemplo: `123456789012345`)
- **API Secret** (manténlo privado)

### 3. Crear Upload Preset
- En tu dashboard, ve a "Settings" → "Upload"
- Haz clic en "Add upload preset"
- Configuración recomendada:
  - **Preset name**: `post-wedding-gallery`
  - **Signing Mode**: `Unsigned` (importante para que funcione desde el navegador)
  - **Folder**: `post-wedding-gallery` (opcional, para organizar)
  - **Access Mode**: `Public`
  - **Unique filename**: `true`
  - **Overwrite**: `false`

### 4. Actualizar configuración en tu app
Edita `src/app/config/app.config.ts`:

```typescript
export const AppConfig = {
  CLOUDINARY: {
    CLOUD_NAME: 'tu-cloud-name-aqui',        // Reemplaza con tu Cloud Name
    UPLOAD_PRESET: 'post-wedding-gallery',   // El preset que creaste
    API_KEY: 'tu-api-key-aqui'              // Reemplaza con tu API Key
  },
  
  GALLERY: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    THUMBNAIL_SIZE: 400,
    PROVIDER: 'cloudinary'  // ← Cambiar a 'cloudinary'
  }
};
```

### 5. Probar la configuración
- Reinicia tu aplicación Angular (`ng serve`)
- Abre la galería post-boda
- Haz clic en "Probar cloudinary"
- Si todo está bien configurado, verás un mensaje de éxito

## Ventajas sobre Google Apps Script:

| Característica | Cloudinary | Google Apps Script |
|---|---|---|
| Configuración | 5 minutos | 30+ minutos |
| CORS | ✅ Sin problemas | ❌ Requiere JSONP |
| Confiabilidad | ✅ 99.9% uptime | ❌ Timeouts frecuentes |
| Velocidad | ✅ CDN global | ❌ Servidor único |
| Límites | ✅ 25GB gratis | ❌ 6 min/ejecución |
| Thumbnails | ✅ Automáticos | ❌ Manual |
| Optimización | ✅ Automática | ❌ Manual |

## Costos:

- **Plan gratuito**: 25GB almacenamiento + 25GB ancho de banda/mes
- **Para una boda típica**: 100-500 fotos = ~2-5GB (bien dentro del límite gratuito)
- **Si necesitas más**: Planes desde $89/mes (pero muy improbable para una boda)

## Alternativas si no quieres usar Cloudinary:

1. **ImgBB** - Más simple, pero menos funciones
2. **Firebase Storage** - Bueno si ya usas Firebase
3. **Supabase Storage** - Open source, similar a Firebase
4. **Mantener Google Apps Script** - Pero necesitas arreglar la configuración

¿Cuál prefieres probar primero?