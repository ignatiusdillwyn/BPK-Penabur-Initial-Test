'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Teacher, {
        foreignKey: 'teacher_id'
      });
      Class.belongsTo(models.Subject, {
        foreignKey: 'subject_id'
      });
      Class.hasMany(models.EnrollmentRequest, {
        foreignKey: 'class_id'
      });

      Class.hasMany(models.Enrollment, {
        foreignKey: 'class_id'
      });
    }
  }

  Class.init({
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "subject_id cannot be null"
        },
        notEmpty: {
          msg: "subject_id cannot be empty"
        },
        isInt: {
          msg: "subject_id must be an integer"
        }
      }
    },

    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "teacher_id cannot be null"
        },
        isInt: {
          msg: "teacher_id must be an integer"
        }
      }
    },

    max_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "max capacity cannot be null"
        },
        isInt: {
          msg: "max capacity must be a number"
        },
        min: {
          args: [1],
          msg: "max capacity must be at least 1"
        }
      }
    },

    current_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    schedule_day: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "schedule_day cannot be null"
        },
        isDate: {
          msg: "schedule_day must be a valid date"
        }
      }
    },

    schedule_start: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "schedule_start cannot be null"
        }
      }
    },

    schedule_end: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "schedule_end cannot be null"
        }
      }
    },

    room: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "room cannot be null"
        },
        notEmpty: {
          msg: "room cannot be empty"
        }
      }
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "status cannot be null"
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'Class'
  });

  return Class;
};