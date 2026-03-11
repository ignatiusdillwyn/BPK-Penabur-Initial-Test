'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IdempotencyKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IdempotencyKey.init({
    key: DataTypes.STRING,
    response: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'IdempotencyKey',
  });
  return IdempotencyKey;
};