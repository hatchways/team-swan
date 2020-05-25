"use strict";
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define("Campaign", {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Name" is required'
        }
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
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

  Campaign.associate = function (models) {
    Campaign.belongsTo(models.User, { foreignKey: "userId" });
    Campaign.hasMany(models.Step, { foreignKey: "campaignId" });
    Campaign.belongsToMany(models.Prospect, {
      through: "CampaignProspect",
      foreignKey: "campaignId",
      onDelete: "CASCADE"
    });
  };

  return Campaign;
};
