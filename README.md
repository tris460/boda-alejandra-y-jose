# 💍 Invitación de Boda - Alejandra & José

Una elegante invitación digital para la boda de Alejandra y José, desarrollada con Angular 20. Esta aplicación web presenta todos los detalles importantes del evento de manera interactiva y responsive, con un diseño corporativo elegante inspirado en una cena de gala.

## ✨ Características

- **Diseño Elegante Corporativo**: Estilo sofisticado con colores #2A3748 y acentos dorados (#D4AF37)
- **Tipografías Premium**: Playfair Display, Montserrat y Dancing Script
- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Multiidioma**: Soporte para español e inglés con selector de banderas
- **Secciones Interactivas**:
  - 🏠 **Inicio**: Presentación principal estilo invitación corporativa
  - �  **Detalles**: Información del evento con contador regresivo hacia el 2 de mayo de 2026
  - 📍 **Ubicación**: Salón Villa Constanza con botón para abrir en Maps
  - 👗 **Para tomar en cuenta**: Código de vestimenta y recomendaciones
  - 🎁 **Regalos**: Mesa de regalos con integración a Google Sheets
  - ✅ **Confirmar asistencia**: Formulario RSVP conectado a Google Sheets
  - 📞 **Contacto**: Información de contacto
- **Reproductor de Música**: Canción especial de los novios con visualizador
- **Galería de Fotos**: Momentos especiales de la pareja
- **Itinerario**: Cronograma detallado del día de la boda
- **Efectos Visuales**: Animaciones sutiles, gradientes y efectos shimmer

## 🎨 Diseño y Estilo

### Paleta de Colores Corporativa
- **Primario**: #2A3748 (Azul oscuro elegante)
- **Secundario**: #1E2A38 (Azul más oscuro)
- **Acento**: #34455A (Azul medio)
- **Dorado principal**: #D4AF37
- **Dorado secundario**: #B8941F
- **Dorado claro**: #E6C547
- **Texto claro**: #F5F5F5
- **Texto suave**: #B8C5D1

### Características Visuales
- ✨ **Gradientes dorados** en botones y elementos destacados
- 🌟 **Sombras profundas** para dar elegancia y profundidad
- 🎭 **Animaciones sutiles** con hover effects y transiciones
- ✨ **Efectos shimmer** en textos importantes
- 🔍 **Blur y transparencias** para elementos modernos
- 🖼️ **Marcos ornamentales** similares a invitaciones corporativas

## 🛠️ Tecnologías

- Angular 20
- TypeScript
- SCSS con variables CSS personalizadas
- Google Apps Script para formularios
- Google Sheets como base de datos
- Responsive Design
- PWA Ready

## 📊 Integración con Google Sheets

### Formulario RSVP
El formulario de confirmación de asistencia está integrado con Google Sheets para recopilar respuestas automáticamente.

**Datos recopilados:**
- Fecha de respuesta
- Nombre completo
- Asistencia (Sí/No)
- Número de invitados
- Mensaje opcional


## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd wedding-invitation

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

Una vez que el servidor esté ejecutándose, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

## 📅 Información del Evento

- **Fecha**: 2 de Mayo de 2026
- **Hora**: 7:00 PM
- **Lugar**: Salón Villa Constanza
- **Pareja**: Alejandra & José
- **Tipo de evento**: Cena de Gala / Boda Elegante

## 📦 Construcción para Producción

Para construir el proyecto para producción:

```bash
ng build --configuration production
```

Los archivos compilados se almacenarán en el directorio `dist/`.

## 🌐 Despliegue Automático en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Configuración Inicial

1. **Habilitar GitHub Pages**:
   - Ve a Settings → Pages en tu repositorio
   - Selecciona "GitHub Actions" como fuente

2. **Configurar el Workflow**:
   El archivo `.github/workflows/deploy.yml` ya está configurado para:
   - Construir la aplicación automáticamente
   - Desplegar en GitHub Pages
   - Ejecutarse en cada push a la rama `main`

### Despliegue Manual

Si necesitas desplegar manualmente:

```bash
# Instalar angular-cli-ghpages (si no está instalado)
npm install -g angular-cli-ghpages

# Construir el proyecto para producción con base-href correcto
ng build --configuration production --base-href="/boda-alejandra-y-jose/"

# Desplegar a GitHub Pages (usar el subdirectorio browser)
npx angular-cli-ghpages --dir=dist/wedding-b-y-e/browser
```

**Importante**: 
- En Angular 17+, los archivos se generan en `dist/wedding-b-y-e/browser/`
- El `--base-href="/boda-alejandra-y-jose/"` es crucial para que GitHub Pages encuentre los recursos correctamente

### URL de Producción
Una vez desplegado, la invitación estará disponible en:
`https://tris460.github.io/boda-alejandra-y-jose/`

**Estado del despliegue**: ✅ Desplegado exitosamente

## 🔧 Configuración de Google Apps Script

### Archivo del Script
El código del Google Apps Script está disponible en `google-apps-script.js` y debe ser copiado al editor de Google Apps Script.

### Funciones Principales
- `doGet(e)`: Maneja requests GET
- `doPost(e)`: Maneja requests POST  
- `handleRequest(params)`: Lógica principal de procesamiento
- `testScript()`: Función de prueba
- `setupSheet()`: Configuración inicial de la hoja

### Configuración del Script
1. Ir a https://script.google.com/
2. Crear nuevo proyecto
3. Pegar el código de `google-apps-script.js`
4. Guardar y desplegar como aplicación web
5. Configurar permisos: "Cualquier persona" puede acceder

## 🧪 Testing

Para ejecutar las pruebas unitarias:

```bash
ng test
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── header/         # Navegación elegante con efectos dorados
│   │   ├── home/           # Página principal estilo invitación corporativa
│   │   ├── details/        # Detalles con contador y reproductor de música
│   │   ├── location/       # Ubicación del evento
│   │   ├── dress-code/     # Código de vestimenta
│   │   ├── registry/       # Mesa de regalos con integración a Sheets
│   │   ├── rsvp/          # Formulario RSVP conectado a Google Sheets
│   │   ├── contact/       # Información de contacto
│   │   ├── gallery/       # Galería de fotos
│   │   ├── itinerary/     # Itinerario del día
│   │   └── footer/        # Pie de página elegante
│   ├── services/          # Servicios (traducción, etc.)
│   ├── pipes/            # Pipes personalizados
│   ├── shared-styles.scss # Estilos compartidos elegantes
│   └── app.scss          # Estilos principales de la aplicación
├── styles.scss            # Estilos globales con tema corporativo
├── public/               # Recursos estáticos (imágenes, audio)
└── google-apps-script.js # Código del Google Apps Script
```

## 🎨 Personalización

### Colores y Estilos
Los colores principales se definen en `src/styles.scss` con variables CSS:
- `--primary-bg`: #2A3748 (Fondo principal)
- `--gold-primary`: #D4AF37 (Dorado principal)
- `--gold-secondary`: #B8941F (Dorado secundario)
- `--text-light`: #F5F5F5 (Texto claro)

### Tipografías
- **Títulos**: Playfair Display (serif elegante)
- **Script**: Dancing Script (para nombres y elementos decorativos)
- **Texto**: Montserrat (sans-serif moderna)

### Traducciones
Las traducciones se gestionan en `src/app/services/translation.service.ts` con soporte completo para español e inglés, incluyendo:
- Textos de la invitación corporativa
- Fechas en ambos idiomas
- Mensajes del formulario RSVP
- Información del evento

### Imágenes
Todas las imágenes se almacenan en la carpeta `public/` y se referencian directamente.

## 🔧 Solución de Problemas

### GitHub Pages
Si obtienes un error 404 al acceder al sitio:

1. **Verificar la construcción**: Asegúrate de que existe `dist/wedding-b-y-e/browser/index.html`
2. **Directorio correcto**: Usa `dist/wedding-b-y-e/browser` (no `dist/wedding-b-y-e`)
3. **Esperar propagación**: GitHub Pages puede tardar unos minutos en actualizar

### Google Sheets Integration
Si el formulario RSVP no funciona:

1. **Verificar URL del script**: Confirmar que el ID del Google Apps Script es correcto
2. **Permisos**: Asegurar que el script tiene permisos de "Cualquier persona"
3. **Logs**: Revisar la consola del navegador para errores
4. **Probar script**: Ejecutar `testScript()` en Google Apps Script

**Comandos de verificación**:
```bash
# Verificar que el build fue exitoso
ls dist/wedding-b-y-e/browser/index.html

# Verificar que el base-href está configurado
grep 'base href="/boda-alejandra-y-jose/"' dist/wedding-b-y-e/browser/index.html

# Si hay problemas, reconstruir y redesplegar
ng build --configuration production --base-href="/boda-alejandra-y-jose/"
npx angular-cli-ghpages --dir=dist/wedding-b-y-e/browser
```

## 📝 Licencia

Este proyecto es de uso personal para la boda de Alejandra & José.

## 💝 Créditos

Desarrollado con ❤️ para celebrar el amor de Alejandra & José

---

### 🎉 Características Especiales

- **Contador regresivo** en tiempo real hacia el 2 de mayo de 2026
- **Reproductor de música** con visualizador animado
- **Formulario RSVP** con validación y confirmación elegante
- **Diseño corporativo** con efectos visuales sofisticados
- **Integración completa** con Google Sheets para gestión de datos
- **Responsive design** optimizado para todos los dispositivos
- **Animaciones CSS** sutiles y profesionales
- **Multiidioma** con cambio dinámico de contenido
