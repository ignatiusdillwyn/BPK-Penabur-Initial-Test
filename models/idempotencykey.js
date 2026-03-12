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
    key: {
      type: DataTypes.STRING,
      unique: true, // Menambahkan constraint unique di level database
      allowNull: false, // Sebaiknya ditambahkan karena unique field sebaiknya tidak null
      validate: {
        notEmpty: {
          msg: "key cannot be empty"
        },
        isUnique: async function (value) {
          const idempotencyKey = await IdempotencyKey.findOne({
            where: { key: value }
          });
          if (idempotencyKey && idempotencyKey.id !== this.id) {
            throw new Error('key must be unique');
          }
        }
      }
    },
    response: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'IdempotencyKey',
  });
  return IdempotencyKey;
};