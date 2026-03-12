'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Subject', [
      {
        id: 1,
        subject_code: 'IPA-01',
        subject_name: 'Fisika',
        credit: 5,
        createdAt: '2025-12-18 12:34:12.643 +0700',
        updatedAt: '2025-12-18 12:34:12.643 +0700'
      },
      {
        id: 2,
        subject_code: 'IPA-02',
        subject_name: 'Geografi',
        credit: 5,
        createdAt: '2025-12-18 12:34:12.643 +0700',
        updatedAt: '2025-12-18 12:34:12.643 +0700'
      },
      {
        id: 3,
        subject_code: 'IPA-03',
        subject_name: 'Kimia',
        credit: 5,
        createdAt: '2025-12-18 12:34:12.643 +0700',
        updatedAt: '2025-12-18 12:34:12.643 +0700'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Subject', {
      id: [1, 2, 3]
    }, {});
  }
};