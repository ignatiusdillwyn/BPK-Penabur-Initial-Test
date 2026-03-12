'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Teacher', [
      {
        name: "Bambang",
        subject_speciality: "Geografi",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Susy",
        subject_speciality: "Fisika",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Santi",
        subject_speciality: "Kimia",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teacher', null, {});
  }
};