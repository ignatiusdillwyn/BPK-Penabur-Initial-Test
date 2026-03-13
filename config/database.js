// config/database.js
const { Sequelize } = require('sequelize');

// HARDCODE connection string dulu (sementara)
const connectionString = 'postgresql://postgres.slbvosmebcfanfzmncha:ignatius_dillwyn@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

console.log('🔌 Connecting to database...');

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = sequelize;