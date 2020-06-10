"use strict";
module.exports = (sequelize, DataTypes) => {
  const CampaignProspect = sequelize.define("CampaignProspect", {
    prospectId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Prospects",
        key: "id",
      },
    },
    campaignId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Campaigns",
        key: "id",
      },
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "active"]],
          msg: "Invalid status type",
        },
      },
    },
    threadId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  CampaignProspect.associate = function (models) {
    CampaignProspect.belongsTo(models.Campaign, { foreignKey: "campaignId" });
    CampaignProspect.belongsTo(models.Prospect, { foreignKey: "prospectId" });
    CampaignProspect.hasMany(models.StepProspect, {
      foreignKey: "campaignProspectId",
    });
  };

  return CampaignProspect;
};
