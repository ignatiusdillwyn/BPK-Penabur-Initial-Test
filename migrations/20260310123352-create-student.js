'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Student', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      grade_level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      priority_level: {
        type: Sequelize.ENUM('regular', 'scholarship', 'special_program'),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Student');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Student_priority_level";'
    );
  }
};