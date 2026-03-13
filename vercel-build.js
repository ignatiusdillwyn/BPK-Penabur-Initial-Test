// vercel-build.js
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Vercel Build Script Running...');

// Force install pg
try {
  console.log('📦 Installing PostgreSQL drivers...');
  
  // Hapus node_modules dulu
  execSync('rm -rf node_modules', { stdio: 'inherit' });
  
  // Install ulang
  execSync('npm install --production', { stdio: 'inherit' });
  
  // Install pg specifically
  execSync('npm install pg@8.11.0 pg-hstore@2.3.4 --save', { stdio: 'inherit' });
  
  console.log('✅ PostgreSQL drivers installed');
} catch (error) {
  console.error('❌ Failed:', error);
  process.exit(1);
}

// Verify installation
try {
  require.resolve('pg');
  console.log('✅ pg module verified');
} catch (error) {
  console.error('❌ pg still missing');
  process.exit(1);
}

console.log('✅ Build complete');