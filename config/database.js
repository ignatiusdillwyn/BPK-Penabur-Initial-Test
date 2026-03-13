// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cek ketersediaan driver PostgreSQL
try {
  require.resolve('pg');
  console.log('✅ PostgreSQL driver (pg) tersedia');
} catch (error) {
  console.error('❌ PostgreSQL driver (pg) tidak ditemukan! Jalankan: npm install pg pg-hstore');
  // Tidak throw error di sini, biarkan Sequelize yang menangani
}

// Gunakan environment variable untuk production, fallback ke connection string untuk development
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.slbvosmebcfanfzmncha:ignatius_dillwyn@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

// Untuk production di Vercel, gunakan connection pooling (port 6543)
const isProduction = process.env.NODE_ENV === 'production';
const finalConnectionString = isProduction 
  ? connectionString.replace(':5432', ':6543') // Gunakan port pooling untuk production
  : connectionString;

console.log(`🔌 Connecting to database (${isProduction ? 'production' : 'development'} mode)...`);

const sequelize = new Sequelize(finalConnectionString, {
  dialect: 'postgres',
  dialectModule: require('pg'), // Explicitly require pg module untuk Vercel
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Penting untuk Supabase
    },
    ...(isProduction && {
      keepAlive: true, // Untuk koneksi serverless
      statement_timeout: 5000, // Timeout query 5 detik
    })
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Logging hanya di development
  pool: {
    max: isProduction ? 2 : 5, // Kurangi pool di production untuk serverless
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3, // Retry 3 kali jika gagal
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ],
    backoffBase: 1000,
    backoffExponent: 1.5
  }
});

// Test koneksi dengan error handling yang lebih baik
async function testConnection() {
  try {
    const startTime = Date.now();
    await sequelize.authenticate();
    const endTime = Date.now();
    
    console.log('✅ Koneksi ke Supabase berhasil!');
    console.log(`⏱️  Waktu koneksi: ${endTime - startTime}ms`);
    
    // Test query sederhana
    const [result] = await sequelize.query('SELECT NOW() as current_time, current_database() as db_name, version() as version');
    console.log(`📅 Database time: ${result[0]?.current_time || 'N/A'}`);
    console.log(`📊 Database name: ${result[0]?.db_name || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Gagal konek ke Supabase:');
    console.error('   - Name:', error.name);
    console.error('   - Message:', error.message);
    
    if (error.original) {
      console.error('   - Original Error:', error.original.message);
      console.error('   - Code:', error.original.code);
    }
    
    // Log connection string (sembunyikan password)
    const sanitizedString = finalConnectionString.replace(/:[^:]*@/, ':****@');
    console.error('   - Connection String:', sanitizedString);
    
    // Di development, kita throw error agar jelas. Di production biarkan berjalan
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }
}

// Jalankan test koneksi hanya jika bukan di Vercel production
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
});

module.exports = sequelize;