'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsTo(models.Teacher)
      Class.hasMany(models.EnrollmentRequest)
      Class.hasMany(models.Enrollment)
    }
  }
  Class.init({
    subject_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    schedule_day: DataTypes.DATE,
    schedule_start: DataTypes.TIME,
    schedule_end: DataTypes.TIME,
    room: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'Class'
  });
  return Class;
};