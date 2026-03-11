'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Audit_Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Audit_Log.init({
    entity: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    old_value: DataTypes.STRING,
    new_value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Audit_Log',
    tableName: 'Audit_Log'
  });
  return Audit_Log;
};

