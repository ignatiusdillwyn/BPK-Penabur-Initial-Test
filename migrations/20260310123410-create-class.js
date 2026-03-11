'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Class', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      subject_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subject', // nama tabel yang direferensikan
          key: 'id'
        },
      },

      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teacher', // nama tabel yang direferensikan
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      max_capacity: {
        type: Sequelize.INTEGER
      },

      current_capacity: {
        type: Sequelize.INTEGER
      },

      schedule_day: {
        type: Sequelize.DATE
      },

      schedule_start: {
        type: Sequelize.TIME
      },

      schedule_end: {
        type: Sequelize.TIME
      },

      room: {
        type: Sequelize.STRING
      },

      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Class');
  }
};