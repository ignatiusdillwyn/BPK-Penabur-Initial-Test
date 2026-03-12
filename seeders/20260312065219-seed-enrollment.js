'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Enrollment', [
      {
        id: 1,
        student_id: 1,
        class_id: 1,
        enrolled_at: '2025-11-17 26:16:58.587 +0700', 
        createdAt: '2025-11-17 26:16:58.587 +0700',
        updatedAt: '2025-11-17 26:16:58.587 +0700'
      },
      {
        id: 2,
        student_id: 1,
        class_id: 2,
        enrolled_at: '2025-11-17 26:16:58.587 +0700',
        createdAt: '2025-11-17 26:16:58.587 +0700',
        updatedAt: '2025-11-17 26:16:58.587 +0700'
      },
      {
        id: 3,
        student_id: 2,
        class_id: 2,
        enrolled_at: '2025-11-17 26:16:58.587 +0700',
        createdAt: '2025-11-17 26:16:58.587 +0700',
        updatedAt: '2025-11-17 26:16:58.587 +0700'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Enrollment', {
      id: [1, 2, 3]
    }, {});
  }
};