"use strict";
module.exports = (sequelize, DataTypes) => {
  const Step = sequelize.define("Step", {
    order: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    campaignId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Campaigns",
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

  Step.associate = function (models) {
    Step.belongsTo(models.Campaign, { foreignKey: "campaignId" });
    Step.hasOne(models.Template, { foreignKey: "stepId" });
  };
  return Step;
};
