'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EnrollmentRequest', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      request_code: {
        type: Sequelize.STRING
      },

      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Student',   // nama tabel
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',   // nama tabel
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      requested_at: {
        type: Sequelize.DATE
      },

      status: {
        type: Sequelize.ENUM('pending', 'enrolled', 'waitlisted', 'rejected', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },

      allow_waitlist: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('EnrollmentRequest');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_EnrollmentRequest_status";'
    );
  }
};