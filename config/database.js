// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Gunakan connection string Supabase Anda
const connectionString = 'postgresql://postgres.slbvosmebcfanfzmncha:ignatius_dillwyn@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Penting untuk Supabase
    }
  },
  logging: false, // Set true untuk melihat query SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test koneksi
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi ke Supabase berhasil!');
  } catch (error) {
    console.error('❌ Gagal konek ke Supabase:', error);
  }
}

testConnection();

module.exports = sequelize;