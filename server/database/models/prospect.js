'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prospect = sequelize.define('Prospect', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Email" is required'
        }
      }
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['open', 'responded', 'unsubscribed']],
          msg: "Invalid status type"
        }
      }
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: '"User Id" is required'
        }
      }
    }
  }, {});
  Prospect.associate = function (models) {
    Prospect.belongsTo(models.User, {
      foreignKey: "userId"
    })
  };
  return Prospect;
};