# Despliegue en Netlify con Cloudinary

## ✅ Ventajas de esta arquitectura:

- **🔒 Seguridad**: Credenciales de Cloudinary solo en el servidor (Netlify Functions)
- **⚡ Rendimiento**: Cache automático y CDN de Netlify
- **🆓 Costo**: Plan gratuito de Netlify + Cloudinary
- **🔧 Simplicidad**: Deploy automático desde Git

## 📋 Pasos para desplegar:

### 1. Preparar el repositorio
```bash
# Asegúrate de que todos los archivos estén committeados
git add .
git commit -m "Setup Netlify Functions for Cloudinary"
git push origin main
```

### 2. Crear sitio en Netlify
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Haz clic en "New site from Git"
3. Conecta tu repositorio de GitHub/GitLab
4. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/post-wedding-gallery`
   - **Functions directory**: `netlify/functions`

### 3. Configurar variables de entorno en Netlify
En tu dashboard de Netlify → Site settings → Environment variables:

```
CLOUDINARY_CLOUD_NAME = dryqm0ye4
CLOUDINARY_API_KEY = 749477636633875
CLOUDINARY_API_SECRET = lh22XfEY6-4WR7W0Cg5Tl-301a4
```

### 4. Deploy automático
- Netlify detectará el `netlify.toml` y configurará todo automáticamente
- Cada push a `main` disparará un nuevo deploy
- Las Functions estarán disponibles en `https://tu-sitio.netlify.app/.netlify/functions/get-images`

## 🧪 Desarrollo local con Netlify CLI

### Instalar Netlify CLI:
```bash
npm install -g netlify-cli
```

### Ejecutar en desarrollo:
```bash
# En lugar de ng serve, usa:
netlify dev

# Esto iniciará:
# - Angular en http://localhost:4200
# - Netlify Functions en http://localhost:8888/.netlify/functions/
```

### Probar la función localmente:
```bash
# Probar la función directamente:
curl http://localhost:8888/.netlify/functions/get-images
```

## 🔧 Estructura del proyecto:

```
proyecto/
├── netlify.toml              # Configuración de Netlify
├── netlify/functions/        # Funciones serverless
│   └── get-images.js        # Función para obtener imágenes
├── .env                     # Variables locales (no commitear)
├── .env.example            # Ejemplo de variables
└── src/                    # Código Angular
    └── app/services/
        └── image-gallery.service.ts  # Actualizado para Netlify
```

## 🚀 URLs importantes:

- **Sitio web**: `https://tu-sitio.netlify.app`
- **Función de imágenes**: `https://tu-sitio.netlify.app/.netlify/functions/get-images`
- **Dashboard**: `https://app.netlify.com/sites/tu-sitio`

## 🔍 Debugging:

### Ver logs de Functions:
1. Netlify Dashboard → Functions → get-images → View logs
2. O usar Netlify CLI: `netlify functions:log get-images`

### Probar en producción:
```bash
# Probar la función en producción:
curl https://tu-sitio.netlify.app/.netlify/functions/get-images
```

## 💡 Próximos pasos opcionales:

1. **Dominio personalizado**: Configurar tu propio dominio
2. **Analytics**: Habilitar Netlify Analytics
3. **Forms**: Usar Netlify Forms para contacto
4. **Identity**: Autenticación de usuarios si necesitas
5. **Edge Functions**: Para funcionalidad más avanzada

## 🆘 Troubleshooting:

### Error: "Function not found"
- Verifica que `netlify.toml` esté en la raíz
- Revisa que la carpeta sea `netlify/functions/`

### Error: "Missing environment variables"
- Verifica las variables en Netlify Dashboard
- Para local, asegúrate de tener `.env`

### Error de CORS:
- Las funciones ya incluyen headers CORS
- Si persiste, verifica la URL de la función

¿Listo para desplegar? 🚀