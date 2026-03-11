'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Waitlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Waitlist.belongsTo(models.EnrollmentRequest, { foreignKey: "request_id" })
      Waitlist.belongsTo(models.Class, { foreignKey: "class_id" })
      Waitlist.belongsTo(models.Student, { foreignKey: "student_id" })
    }
  }
  Waitlist.init({
    request_id: DataTypes.INTEGER,
    position: DataTypes.STRING,
    class_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Waitlist',
    tableName: 'Waitlist'
  });
  return Waitlist;
};