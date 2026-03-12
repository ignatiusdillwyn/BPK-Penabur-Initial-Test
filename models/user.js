'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email tidak boleh null"
          },
          notEmpty: {
            msg: "Email tidak boleh kosong"
          },
          isEmail: {
            msg: "Format email tidak valid"
          },
          isString(value) {
            if (typeof value !== "string") {
              throw new Error("Email harus berupa string");
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password tidak boleh null"
          },
          notEmpty: {
            msg: "Password tidak boleh kosong"
          },
          isString(value) {
            if (typeof value !== "string") {
              throw new Error("Password harus berupa string");
            }
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'User'
    }
  );

  return User;
};