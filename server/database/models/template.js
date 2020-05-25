"use strict";
module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define("Template", {
    subject: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Subject" is required'
        }
      }
    },
    body: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Subject" is required'
        }
      }
    },
    stepId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Steps",
        key: "id"
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });

  Template.associate = function (models) {
    Template.belongsTo(models.Step, { foreignKey: "stepId" });
  };

  return Template;
};
