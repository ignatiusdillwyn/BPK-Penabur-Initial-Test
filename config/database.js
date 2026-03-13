// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cek ketersediaan driver PostgreSQL dengan cara yang lebih baik
let pg;
try {
  pg = require('pg');
  console.log('✅ PostgreSQL driver (pg) tersedia');
} catch (error) {
  console.error('❌ PostgreSQL driver (pg) tidak ditemukan!');
  console.error('Error:', error.message);
  // Jangan throw, biarkan Sequelize handle
}

// Gunakan environment variable untuk production
const connectionString = process.env.DATABASE_URL;

// Untuk production di Vercel, gunakan connection pooling (port 6543)
const isProduction = process.env.NODE_ENV === 'production';
const finalConnectionString = isProduction && connectionString
  ? connectionString.replace(':5432', ':6543')
  : connectionString || 'postgresql://postgres.slbvosmebcfanfzmncha:ignatius_dillwyn@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

console.log(`🔌 Connecting to database (${isProduction ? 'production' : 'development'} mode)...`);

// Buat sequelize instance dengan error handling
let sequelize;
try {
  sequelize = new Sequelize(finalConnectionString, {
    dialect: 'postgres',
    dialectModule: pg, // Gunakan variable pg, bukan require langsung
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      ...(isProduction && {
        keepAlive: true,
        statement_timeout: 5000,
      })
    },
    logging: false, // Matikan logging di production
    pool: {
      max: isProduction ? 1 : 2, // Kurangi pool untuk serverless
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} catch (error) {
  console.error('❌ Failed to create Sequelize instance:', error.message);
  // Export dummy sequelize agar app tetap jalan
  module.exports = { query: () => {}, authenticate: () => Promise.reject() };
  return;
}

// Test koneksi (tapi jangan block)
if (!isProduction) {
  sequelize.authenticate()
    .then(() => console.log('✅ Database connection OK'))
    .catch(err => console.error('❌ Database connection failed:', err.message));
}

module.exports = sequelize;