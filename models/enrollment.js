'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {

    static associate(models) {

      Enrollment.belongsTo(models.Student, {
        foreignKey: "student_id"
      });

      Enrollment.belongsTo(models.Class, {
        foreignKey: "class_id"
      });

    }
  }

  Enrollment.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    enrolled_at: {
      type: DataTypes.DATE
    }

  }, {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'Enrollment'
  });

  return Enrollment;
};