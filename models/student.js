'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.hasMany(models.Enrollment, {
        foreignKey: "student_id"
      });
      Student.hasMany(models.EnrollmentRequest, {
        foreignKey: "student_id"
      });
      Student.hasMany(models.Waitlist, {
        foreignKey: "student_id"
      });
    }
  }

  Student.init({
    student_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Menambahkan constraint unique di level database
      validate: {
        notEmpty: {
          msg: "student_number cannot be empty"
        },
        isUnique: async function (value) {
          const student = await Student.findOne({
            where: { student_number: value }
          });
          if (student && student.id !== this.id) {
            throw new Error('student_number must be unique');
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name cannot be empty"
        }
      }
    },
    grade_level: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "grade_level cannot be empty"
        }
      }
    },
    priority_level: {
      type: DataTypes.ENUM('regular', 'scholarship', 'special_program'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "priority_level cannot be empty"
        },
        isIn: {
          args: [['regular', 'scholarship', 'special_program']],
          msg: "priority_level must be regular, scholarship, or special_program"
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "status cannot be empty"
        }
      }
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'Student'
  });

  return Student;
};