'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subject.hasMany(models.Class, { foreignKey: 'subject_id' })
    }
  }
  Subject.init({
    subject_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "subject_code cannot be empty"
        },
        isUnique: async function(value) {
          const subject = await Subject.findOne({
            where: { subject_code: value }
          });
          if (subject && subject.id !== this.id) {
            throw new Error('subject_code must be unique');
          }
        }
      }
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "subject_name cannot be empty"
        }
      }
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "credit must be an integer"
        },
        min: {
          args: [1], // Mengubah dari 0 menjadi 1
          msg: "credit cannot be below 1"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Subject',
    tableName: 'Subject'
  });
  return Subject;
};