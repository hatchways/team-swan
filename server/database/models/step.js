"use strict";
module.exports = (sequelize, DataTypes) => {
  const Step = sequelize.define("Step", {
    order: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    campaignId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Campaigns",
        key: "id"
      }
    },
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
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: '"Body" is required'
        }
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

  Step.associate = function (models) {
    Step.belongsTo(models.Campaign, { foreignKey: "campaignId" });
  };
  return Step;
};
