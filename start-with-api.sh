#!/bin/bash
# Script para ejecutar el proyecto con Google Places API

echo "🚀 Iniciando Charcutería Los Molina con Google Places API..."
echo ""
echo "📌 Asegúrate de que:"
echo "   ✓ El archivo .env existe con GOOGLE_PLACES_API_KEY"
echo "   ✓ Node.js está instalado"
echo "   ✓ npm install ya fue ejecutado"
echo ""

# Verificar si .env existe
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado"
    echo "📋 Creando .env desde .env.example..."
    cp .env.example .env
fi

echo "✅ Iniciando..."
echo ""
echo "🔗 Abrirá en:"
echo "   - Angular:  http://localhost:4200"
echo "   - Backend:  http://localhost:3000"
echo ""

npm run dev
