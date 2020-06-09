"use strict";
module.exports = (sequelize, DataTypes) => {
  const StepProspect = sequelize.define("StepProspect", {
    campaignProspectId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      onDelete: "CASCADE",
      references: {
        model: "CampaignProspects",
        key: "id",
      },
    },
    stepId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      onDelete: "CASCADE",
      references: {
        model: "Steps",
        key: "id",
      },
    },
    threadId: {
      type: DataTypes.STRING,
    },
    contacted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    replied: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    currentStep: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
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
  StepProspect.associate = function (models) {
    StepProspect.belongsTo(models.Step, { foreignKey: "stepId" });
    StepProspect.belongsTo(models.CampaignProspect, {
      foreignKey: "campaignProspectId",
    });
  };
  return StepProspect;
};
