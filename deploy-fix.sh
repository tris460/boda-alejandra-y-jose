#!/bin/bash

# Script para solucionar el problema de GitHub Pages
# Ejecutar con: bash deploy-fix.sh

echo "🔧 Solucionando problema de GitHub Pages..."

# Limpiar build anterior
echo "📁 Limpiando build anterior..."
rm -rf dist/

# Construir con base-href correcto
echo "🏗️ Construyendo con base-href correcto..."
ng build --configuration production --base-href="/boda-alejandra-y-jose/"

# Verificar que el build fue exitoso
if [ -f "dist/wedding-b-y-e/browser/index.html" ]; then
    echo "✅ Build exitoso"
    
    # Mostrar el base-href configurado
    echo "🔍 Base-href configurado:"
    grep "base href" dist/wedding-b-y-e/browser/index.html
    
    # Desplegar
    echo "🚀 Desplegando a GitHub Pages..."
    npx angular-cli-ghpages --dir=dist/wedding-b-y-e/browser
    
    echo "✅ Despliegue completado"
    echo "🌐 Tu sitio estará disponible en: https://tris460.github.io/boda-alejandra-y-jose/"
    
else
    echo "❌ Error en el build. Verifica que Angular CLI esté instalado."
fi