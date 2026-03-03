#!/usr/bin/env node

/**
 * Script de diagnóstico para Google Places API Integration
 * Ejecuta: node diagnose.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DIAGNÓSTICO: Google Places API Integration\n');
console.log('=' .repeat(60));

// Test 1: Archivos necesarios
console.log('\n✓ TEST 1: Verificar archivos necesarios\n');

const requiredFiles = [
  '.env',
  'server/places-proxy.js',
  'src/app/shared/services/google-places.service.ts',
  'src/app/components/reviews-slider/reviews-slider.ts',
  'public/data/reviews.json'
];

let filesOk = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
  if (!exists) filesOk = false;
});

// Test 2: .env configuration
console.log('\n✓ TEST 2: Verificar .env\n');

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const hasApiKey = envContent.includes('GOOGLE_PLACES_API_KEY');
  const hasBackendPort = envContent.includes('BACKEND_PORT');
  
  console.log(`  ${hasApiKey ? '✅' : '❌'} GOOGLE_PLACES_API_KEY configurada`);
  console.log(`  ${hasBackendPort ? '✅' : '❌'} BACKEND_PORT configurada`);
} else {
  console.log('  ❌ .env no existe');
}

// Test 3: package.json scripts
console.log('\n✓ TEST 3: Verificar package.json scripts\n');

if (fs.existsSync('package.json')) {
  const pkgContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = pkgContent.scripts || {};
  
  console.log(`  ${scripts.server ? '✅' : '❌'} Script "npm run server" existe`);
  console.log(`  ${scripts.dev ? '✅' : '❌'} Script "npm run dev" existe`);
  console.log(`  ${scripts.start ? '✅' : '❌'} Script "npm start" existe`);
} else {
  console.log('  ❌ package.json no existe');
}

// Test 4: Dependencies
console.log('\n✓ TEST 4: Verificar dependencias\n');

if (fs.existsSync('package.json')) {
  const pkgContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...pkgContent.dependencies, ...pkgContent.devDependencies };
  
  const required = ['express', 'cors', 'axios', 'dotenv', 'concurrently'];
  required.forEach(dep => {
    const hasIt = deps[dep];
    console.log(`  ${hasIt ? '✅' : '❌'} ${dep}`);
  });
} else {
  console.log('  ❌ package.json no existe');
}

// Test 5: Service configuration
console.log('\n✓ TEST 5: Verificar GooglePlacesService\n');

if (fs.existsSync('src/app/shared/services/google-places.service.ts')) {
  const serviceContent = fs.readFileSync('src/app/shared/services/google-places.service.ts', 'utf8');
  
  console.log(`  ${serviceContent.includes('GooglePlacesService') ? '✅' : '❌'} Servicio definido`);
  console.log(`  ${serviceContent.includes('getBusinessReviews') ? '✅' : '❌'} Método getBusinessReviews existe`);
  console.log(`  ${serviceContent.includes('localhost:3000') ? '✅' : '❌'} Backend proxy URL configurada`);
} else {
  console.log('  ❌ GooglePlacesService no existe');
}

// Test 6: ReviewsSlider component
console.log('\n✓ TEST 6: Verificar ReviewsSliderComponent\n');

if (fs.existsSync('src/app/components/reviews-slider/reviews-slider.ts')) {
  const componentContent = fs.readFileSync('src/app/components/reviews-slider/reviews-slider.ts', 'utf8');
  
  console.log(`  ${componentContent.includes('GooglePlacesService') ? '✅' : '❌'} Importa GooglePlacesService`);
  console.log(`  ${componentContent.includes('getBusinessReviews') ? '✅' : '❌'} Llama a getBusinessReviews()`);
  console.log(`  ${componentContent.includes('loadLocalReviews') ? '✅' : '❌'} Tiene fallback a JSON local`);
} else {
  console.log('  ❌ ReviewsSliderComponent no existe');
}

// Test 7: Backend proxy syntax
console.log('\n✓ TEST 7: Verificar syntax del backend proxy\n');

if (fs.existsSync('server/places-proxy.js')) {
  const serverContent = fs.readFileSync('server/places-proxy.js', 'utf8');
  
  console.log(`  ${serverContent.includes('require(') ? '✅' : '❌'} Usa require() (CommonJS)`);
  console.log(`  ${serverContent.includes('app.get') ? '✅' : '❌'} Endpoint GET definido`);
  console.log(`  ${serverContent.includes('3000') ? '✅' : '❌'} Puerto 3000 configurado`);
  console.log(`  ${serverContent.includes('cors()') ? '✅' : '❌'} CORS habilitado`);
} else {
  console.log('  ❌ Backend proxy no existe');
}

// Final summary
console.log('\n' + '='.repeat(60));
console.log('\n📋 RESUMEN:\n');

if (filesOk && fs.existsSync('.env')) {
  console.log('✅ Todo parece estar correctamente configurado.\n');
  console.log('Próximos pasos:');
  console.log('  1. npm install --save-dev express cors axios dotenv concurrently');
  console.log('  2. npm run dev');
  console.log('  3. Abre http://localhost:4200');
  console.log('  4. Navega a /ubicacion');
  console.log('  5. Abre F12 Console y busca el mensaje de reseñas\n');
} else {
  console.log('❌ Hay problemas en la configuración. Verifica arriba.\n');
  console.log('Soluciones rápidas:');
  console.log('  1. npm install --save-dev express cors axios dotenv concurrently');
  console.log('  2. Copia .env.example a .env');
  console.log('  3. node diagnose.js (vuelve a ejecutar este script)\n');
}

console.log('=' .repeat(60) + '\n');
