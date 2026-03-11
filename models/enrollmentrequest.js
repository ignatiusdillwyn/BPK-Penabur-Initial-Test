'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EnrollmentRequest extends Model {
    static associate(models) {
      EnrollmentRequest.belongsTo(models.Student, { foreignKey: "student_id" })
      EnrollmentRequest.belongsTo(models.Class, { foreignKey: "class_id" })
    }
  }

  EnrollmentRequest.init({
    request_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "request_code cannot be empty"
        }
      }
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "student_id is required"
        },
        isInt: {
          msg: "student_id must be a number"
        }
      }
    },

    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "class_id is required"
        },
        isInt: {
          msg: "class_id must be a number"
        }
      }
    },

    requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "requested_at is required"
        },
        isDate: {
          msg: "requested_at must be a valid date"
        }
      }
    },

    status: {
      type: DataTypes.ENUM('pending', 'enrolled', 'waitlisted', 'rejected', 'cancelled'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "status cannot be empty"
        },
        isIn: {
          args: [['pending', 'enrolled', 'waitlisted', 'rejected', 'cancelled']],
          msg: "status must be pending, enrolled, waitlisted, rejected, or cancelled"
        }
      }
    },

    allow_waitlist: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "allow_waitlist is required"
        },
        isBoolean: {
          msg: "allow_waitlist must be true or false"
        }
      }
    }

  }, {
    sequelize,
    modelName: 'EnrollmentRequest',
    tableName: 'EnrollmentRequest'
  });

  return EnrollmentRequest;
};