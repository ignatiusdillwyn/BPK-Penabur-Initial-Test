'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.hasMany(models.Class, { foreignKey: 'teacher_id' })
    }
  }
  Teacher.init({
    name: DataTypes.STRING,
    subject_speciality: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teacher'
  });
  return Teacher;
};