'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subject', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject_code: {
        type: Sequelize.STRING,
        unique: true,  
        allowNull: false 
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      credit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1 // Validasi di level Sequelize
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    // Menambahkan constraint check di level database
    await queryInterface.sequelize.query(`
      ALTER TABLE "Subject" 
      ADD CONSTRAINT "credit_check" 
      CHECK (credit > 0);
    `);
  },
  async down(queryInterface, Sequelize) {
    // Menghapus constraint check sebelum drop table
    await queryInterface.sequelize.query(`
      ALTER TABLE "Subject" 
      DROP CONSTRAINT IF EXISTS "credit_check";
    `);
    
    await queryInterface.dropTable('Subject');
  }
};