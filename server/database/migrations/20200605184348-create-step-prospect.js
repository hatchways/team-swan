"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("StepProspects", {
      campaignProspectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: "CASCADE",
        references: {
          model: "CampaignProspects",
          key: "id",
        },
      },
      stepId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: "CASCADE",
        references: {
          model: "Steps",
          key: "id",
        },
      },
      contacted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      replied: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currentStep: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("StepProspects");
  },
};
